# Specify the base image
FROM node:16

# Set the working directory
WORKDIR /frontend

# Copy the application files
COPY . /frontend

# Install dependencies
COPY ./package*.json  /frontend/
RUN yarn install

# Specify the command to run the application
CMD ["npm", "start"]
