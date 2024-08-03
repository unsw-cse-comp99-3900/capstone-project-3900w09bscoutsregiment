# Use an official node js image
FROM node:18

# Install dependencies for canvas
RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

# Create the app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Ensure that the node_modules directory is rebuilt when the image is built
RUN rm -rf node_modules
RUN rm -rf package-lock.json

# Install app dependencies
RUN npm install 

# Copy all the code needed to run the app
COPY . .

# Expose the port the app runs on
EXPOSE 5100

# Start the app
CMD ["npm", "run", "dev"]
