#Use an official node js image
FROM node:20

# Create the app directory
WORKDIR /app

# Install app dependencies 
COPY package.json ./

RUN rm -rf node_modules
RUN rm -rf package-lock.json

RUN npm install 

# Copy all the code needed to run the app
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"] 