FROM node:19.8.1 as build-stage
WORKDIR /app
COPY package*.json ./

RUN npm install --global npm@6.14.15
RUN npm install

COPY . .

RUN npm run build


FROM nginx:1.25.4-alpine3.18 as production-stage
COPY nginx.conf /etc/nginx/nginx.conf


COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

