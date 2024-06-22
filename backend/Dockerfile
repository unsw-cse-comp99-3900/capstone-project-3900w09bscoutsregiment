FROM node:20

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

#ENV PORT=8080

EXPOSE 3001

CMD ["npm", "run", "dev"]
