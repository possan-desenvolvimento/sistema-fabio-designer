FROM nginx:alpine

# Copia a árvore inteira pra dentro do Nginx, preservando a estrutura
COPY src /usr/share/nginx/html/src
COPY public /usr/share/nginx/html/public

# Redireciona a raiz do site pra /src/pages/index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index src/pages/index.html;\n\
    location / {\n\
        try_files $uri $uri/ /src/pages/index.html;\n\
    }\n\
    location ~ ^/(css|js|assets|public)/ {\n\
        root /usr/share/nginx/html/src;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]