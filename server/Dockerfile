FROM node:20.5.0-alpine
WORKDIR /app
COPY . .
RUN apk update \
    && apk add --no-cache sox \
    # alsa-lib alsa-utils \
    && npm install
CMD ["npm", "start"]