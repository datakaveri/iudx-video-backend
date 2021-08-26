FROM node:12 as ui-build

WORKDIR /app

ARG ui_path=/home/ubuntu/iudx-video-frontend

COPY ${ui_path}/package*.json .
RUN npm i 
COPY ${ui_path} .
RUN npm run build

FROM nginx

COPY --from=ui-build /app/build /usr/share/nginx/html/ui

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443 4040
CMD ["nginx", "-g", "daemon off;"]