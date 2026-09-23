FROM nginx:alpine

COPY src/pages /usr/share/nginx/html/
COPY src/css /usr/share/nginx/html/css/
COPY src/js /usr/share/nginx/html/js/
COPY src/assets /usr/share/nginx/html/assets/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]