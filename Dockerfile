FROM node:20-alpine

RUN apk update && apk add --no-cache \
  sox \
  python3 \
  make \
  g++ \
  alsa-lib alsa-utils

WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm install

EXPOSE 5100

CMD ["npm", "start"]



#
#
#
#FROM node:16-alpine AS client-build
#
#WORKDIR /app
#COPY client ./client
#WORKDIR /app/client
#RUN npm install && npm run build
#
#
#FROM node:20.5.0-alpine
#
#WORKDIR /app
#RUN apk update && apk add --no-cache alsa-lib alsa-utils
#COPY server ./server
#COPY --from=client-build /app/client/build ./server/public
#
#WORKDIR /app/server
#RUN npm install
#
#EXPOSE 5100
#
#CMD ["npm", "start"]
