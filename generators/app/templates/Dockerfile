FROM node:10

# Set the workdir /var/www/myapp
WORKDIR /app

# Copy the package.json to workdir
COPY package.json ./

# Run npm install - install the npm dependencies
RUN npm install --production --silent

# Copy application source
COPY . .

# Copy .env.docker to workdir/.env - use the docker env
# COPY .env.docker ./.env

EXPOSE 3000

RUN npm i pm2 -g

ENV PM2_PUBLIC_KEY [PM2_PUBLIC_KEY]
ENV PM2_SECRET_KEY [PM2_SECRET_KEY]


# Start the application
CMD ["npm","run", "start:prod"]