FROM node:17.4.0-alpine3.14

WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package*.json ./
# Install all Packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app
# TypeScript
# RUN npm run tsc
# Start
CMD [ "npm", "start" ]
# set Docker port
EXPOSE 5001

