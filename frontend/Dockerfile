FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

#ENV PORT=8080

EXPOSE 3000
# bUILD THEN RUN DEV?
CMD ["npm", "run", "dev"] 