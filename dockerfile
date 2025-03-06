# Use an official Node.js image as a base
FROM node:22

ARG PORT
# Set the working directory to /app
WORKDIR /app

# Copy the package.json file to the working directory
COPY package*.json .

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port that the app will use
EXPOSE 3000-3100

# Run the command to start the app when the container launches
CMD ["npm", "start"]