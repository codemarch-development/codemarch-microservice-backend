FROM node

WORKDIR /app/codecamps

COPY package.json .

# Install build dependencies for bcrypt and then install all npm packages
RUN npm install

COPY . .

# Compile TypeScript files
RUN npx tsc


EXPOSE 8003

CMD ["npm", "start"]



