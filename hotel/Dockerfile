FROM node:14
WORKDIR /code/hotels

# add and install dependencies
COPY package*.json ./
RUN npm install

# add app code
COPY . .

# run
CMD npm start