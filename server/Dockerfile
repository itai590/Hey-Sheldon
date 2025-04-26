FROM node:20-alpine

RUN apk add --no-cache python3 make g++ sox alsa-lib alsa-utils

WORKDIR /app/server
COPY . .
RUN npm install

EXPOSE 5100

CMD ["npm", "start"]
