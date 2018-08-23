FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf

COPY dist/coincola /usr/share/nginx/html
