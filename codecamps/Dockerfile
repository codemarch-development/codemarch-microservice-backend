FROM node

WORKDIR /app/codecamps

COPY package.json .

# Install build dependencies for bcrypt and then install all npm packages
RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm","start"]



