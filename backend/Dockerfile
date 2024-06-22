FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

#ENV PORT=8080

EXPOSE 3001

CMD ["node", "index.ts"]
