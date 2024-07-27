FROM node:18

RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN rm -rf package-lock.json

RUN npm install 

COPY . .

#ENV PORT=8080

EXPOSE 5000

# RUN npm rebuild canvas

CMD ["npm", "run", "dev"]
