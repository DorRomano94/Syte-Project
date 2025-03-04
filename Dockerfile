FROM node:20

RUN apt-get update && apt-get install -y wget \
    && wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && mv dockerize /usr/local/bin/
 
WORKDIR /app
 
COPY package*.json ./
RUN npm install
 
COPY . .
 
CMD ["dockerize", "-wait", "tcp://mysql_db:3306", "-timeout", "30s", "npm", "run", "start"]