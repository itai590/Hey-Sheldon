FROM node:16-bullseye AS build
WORKDIR /app
COPY package*.json ./
# RUN npm install --legacy-peer-deps
RUN yarn install --frozen-lockfile

COPY . .
# RUN npm run build
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]