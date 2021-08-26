FROM node:12 as ui-build

WORKDIR /app

COPY ./package*.json /app/
RUN npm i 
COPY . /app/
RUN npm run build

FROM nginx

COPY --from=ui-build /app/build /usr/share/nginx/html/ui

EXPOSE 80 443 4040
CMD ["nginx", "-g", "daemon off;"]