FROM node:14
WORKDIR /instagram
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "node", "app.js" ]
