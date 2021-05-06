FROM node:14
WORKDIR /code/client

# add and install dependencies
COPY package*.json ./
RUN npm install
ENV DEBUG=*

# add app code
COPY . .

# run
CMD npm start