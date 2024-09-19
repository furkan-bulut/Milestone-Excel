FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of your app's code
COPY . .

# Expose the necessary port
EXPOSE 3000

# Start the app
CMD ["server.js"]
