FROM node

WORKDIR /app/courses

COPY package.json .

# Install build dependencies for bcrypt and then install all npm packages
RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm","start"]



