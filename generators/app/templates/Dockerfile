FROM node:10

# Set the workdir /var/www/myapp
WORKDIR /var/www/app

# Copy the package.json to workdir
COPY package.json ./

# Run npm install - install the npm dependencies
RUN npm install --production --silent

# Copy application source
COPY . .

# Copy .env.docker to workdir/.env - use the docker env
# COPY .env.docker ./.env

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 3000


# Start the application
CMD ["npm", "run", "run:prod"]