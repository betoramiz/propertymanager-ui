FROM node:alpine AS build

WORKDIR /app

COPY ./ .

RUN npm install
ENV configuration=development
RUN npm run build -- --configuration ${configuration}

FROM nginx:alpine

WORKDIR /app

EXPOSE 4200

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/admin/browser /usr/share/nginx/html