# Base image to use
FROM node:18-alpine 
#Create the directory we're going to use
# RUN mkdir -p /usr/src/app
# Set it as work directory
ENV OPENAI_API_KEY="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"
ENV PORT=3000

WORKDIR /app
# Copy all the code to our work directory
COPY . .
# Install all our dependencies
RUN npm install
# Expose the port we want to communicate on
EXPOSE 3000
# Start the container
CMD [ "npm", "start"]
