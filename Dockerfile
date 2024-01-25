# # Base image to use
# FROM node:18-alpine 
# #Create the directory we're going to use
# # RUN mkdir -p /usr/src/app
# # Set it as work directory

# WORKDIR /app
# # Copy all the code to our work directory
# COPY . .
# # Install all our dependencies
# RUN npm install
# # Expose the port we want to communicate on
# EXPOSE 3000
# # Start the container
# CMD [ "npm", "start"]

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn global add typescript
RUN yarn build

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
RUN yarn install
CMD [ "yarn", "start" ]