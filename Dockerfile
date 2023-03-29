FROM node:19-alpine as builder

WORKDIR /code
COPY package.json /code
COPY package-lock.json /code
COPY .env /code
COPY tsconfig.json /code
COPY . /code
RUN npm install
RUN npm run swagger-autogen
ENTRYPOINT ["node"]
CMD [ "dist/index.js"]
