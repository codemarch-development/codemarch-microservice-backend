FROM node

WORKDIR /app/customer

COPY package.json .

# Install build dependencies for bcrypt and then install all npm packages
RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm","start"]