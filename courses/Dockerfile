FROM node

WORKDIR /app/courses

COPY package.json .

# Install build dependencies for bcrypt and then install all npm packages
RUN npm install

COPY . .

RUN npx tsc
# Make sure your package.json has a "build" script that compiles TypeScript, 
# typically it looks like: "build": "tsc"

EXPOSE 8002

CMD ["npm", "start"]



