# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first (better caching)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose React development server port
EXPOSE 3000

# Enable hot reload by running React in development mode
CMD ["npm", "start"]
