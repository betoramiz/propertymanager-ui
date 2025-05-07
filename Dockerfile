FROM node:alpine AS build

WORKDIR /app

COPY ./ .

RUN npm install

RUN npm run build

FROM nginx:alpine

WORKDIR /app

EXPOSE 4200

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/admin/browser /usr/share/nginx/html