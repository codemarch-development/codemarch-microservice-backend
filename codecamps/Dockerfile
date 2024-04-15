FROM node

# Set the working directory
WORKDIR /app/codecamps

# Copy package.json and package-lock.json
COPY package*.json ./

# Install build dependencies for bcrypt and then install all npm packages
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Compile TypeScript files
RUN npx tsc

# Expose the port the app runs on
EXPOSE 8003

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
