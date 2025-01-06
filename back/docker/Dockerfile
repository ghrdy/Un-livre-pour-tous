FROM node:18-alpine

# Install necessary build tools
RUN apk add --no-cache make gcc g++ python3

# Define the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt to ensure compatibility
RUN npm rebuild bcrypt

# Copy the rest of the application files
COPY . .

# Expose the port the application listens on
EXPOSE 5001

# Run the createAdmin script
RUN node createAdmin.js

# Start the application
CMD ["npm", "start"]