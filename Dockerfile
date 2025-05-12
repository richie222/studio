# Use a Node.js image as the base image
FROM node:20-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lean production image
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=base /app/.next/ ./.next/
COPY --from=base /app/node_modules/ ./node_modules/
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/src/ai/genkit.ts ./src/ai/genkit.ts

# Expose the port the app runs on
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "start"]