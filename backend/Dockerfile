FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

#ENV PORT=8080

EXPOSE 5000

# CMD ["node", "index.ts"]
CMD ["npm", "run", "dev"]
