# Base image to use
FROM node:18-alpine 
#Create the directory we're going to use
# RUN mkdir -p /usr/src/app
# Set it as work directory

WORKDIR /app
# Copy all the code to our work directory
COPY . .
# Install all our dependencies
RUN npm install
# Expose the port we want to communicate on
EXPOSE 3000
# Start the container
CMD [ "npm", "start"]
