FROM node

WORKDIR /app/customer

COPY package.json .

# Install build dependencies for bcrypt and then install all npm packages
RUN npm install

COPY . .

RUN npx tsc
# Make sure your package.json has a "build" script that compiles TypeScript, 
# typically it looks like: "build": "tsc"

EXPOSE 8001

CMD ["node", "dist/index.js"]