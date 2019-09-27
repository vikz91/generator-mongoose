#!/bin/bash
# ------------------------------------------------------------------
# [Abhishek Deb] Restologic App Installer
#          Run this script to automatically install all required 
#            dependencies and environment required for this app.
# ------------------------------------------------------------------

VERSION=0.1.0
USAGE="Usage: command -ihv args"

echo "[ 1% ] Installing Environment  [1%]"

echo "[ 5%]" Installing SSL

sudo apt-get install software-properties-common -y
sudo add-apt-repository universe -y
sudo add-apt-repository ppa:certbot/certbot -y
sudo apt-get install certbot python-certbot-nginx -y

echo "[ 10% ] Installing NodeJS ..."
cd ~
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get update -y
sudo bash nodesource_setup.sh
sudo apt-get install nodejs -y
sudo apt install build-essential -y


curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn


echo "[ 30% ] Installing Redis ..."
sudo apt install redis-server -y
sudo sed 's/supervised no/supervised systemd/g' /etc/redis/redis.conf > /etc/redis/redis.conf
sudo systemctl restart redis.service

echo "[ 60% ] Installing Reverse Proxy ..."
sudo npm i -g pm2
sudo apt install nginx  -y
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'

sudo cp -f ./conf/nginx /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx

echo "[ 80% ] Enabling Startup app ..."
cd $(dirname $0)/../
yarn install
mkdir logs
pm2 flush
export NODE_ENV=development && pm2 start index.js --name app
pm2 dump
pm2 save
pm2 startup


echo "[ 100% ] INstallation Complete. Opening Log ..."
pm2 logs