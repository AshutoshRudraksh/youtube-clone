# Use an official Node runtime built on top of the Linux operating system
FROM node:18 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages from package.json
RUN npm install

# Copy app source code inside the Docker image
COPY . .

# Build the app
RUN npm run build

# -------- stage 2: Production stage ------
FROM node:18 

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# Make port 3000 available outside the container
EXPOSE 3000

# Define the command to run your app using CMD (only one CMD allowed)
CMD ["npm", "run", "serve"]


#  Identify the Process Using Port 3000:
#  Run the following command to identify the process:
#   -$ lsof -i :3000
#   Kill the Process:
#   Once you have the process ID (PID), you can stop it using the kill command:
#    -$ kill -9 <PID>
#   Option 2: Use a Different Port
#   Change the Port Mapping:
#   You can run your Docker container on a different port by changing the port mapping in the docker run command:
#    - $ docker run -p 3001:3000 -d video-processing-service
