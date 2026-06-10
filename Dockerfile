FROM node:22-alpine

ARG NODE_OPTIONS="--max-old-space-size=1536"
ENV NODE_OPTIONS="${NODE_OPTIONS}"
ENV NEXT_TELEMETRY_DISABLED=1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
# Copy Prisma schema
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client for the specific platform
RUN npx prisma generate

# Bundle app source
COPY . .

# Build the app. Works without buildkit.
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]