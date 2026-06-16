# Use Node.js 20 LTS version as the base image
FROM node:20-alpine

# Install FFmpeg with all necessary codecs
RUN apk add --no-cache ffmpeg

# You can also install as follows for full scale functionality (not needed for this project):
# FROM node:20
# RUN apt update && apt install ffmpeg -y

# Create app directory
WORKDIR /usr/src/app

# Install PM2 globally
RUN npm install pm2 -g

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8000

#Using pm2-runtime instead of pm2 start is important for Docker as it's designed to run as the main process in a container
# Start the application using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
