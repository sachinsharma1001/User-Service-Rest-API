# Use NodeJS base image
FROM node:10

ENV AWS_MEDIA_BUCKET: $AWS_MEDIA_BUCKET
ENV AWS_PROFILE: $AWS_PROFILE
ENV AWS_REGION: $AWS_REGION
ENV JWT_SECRET: helloworld
ENV POSTGRES_USERNAME: $POSTGRES_USERNAME
ENV POSTGRES_PASSWORD: $POSTGRES_PASSWORD
ENV POSTGRESS_DB: $POSTGRESS_DB
ENV POSTGRESS_HOST: $POSTGRESS_HOST
ENV URL: http://localhost:8100

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Bind the port that the image will run on
EXPOSE 8080

# Define the Docker image's behavior at runtime
CMD ["npm", "run", "dev"]
