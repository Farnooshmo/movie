# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the server directory to the /app directory in the container
COPY ./server /app

# Expose the port your app runs on
EXPOSE 4000

# Run your app
CMD ["node", "server.js"]
