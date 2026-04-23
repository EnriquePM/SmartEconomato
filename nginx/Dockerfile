FROM nginx:1.27-alpine

RUN apk add --no-cache openssl

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/start-nginx.sh /usr/local/bin/start-nginx.sh
RUN sed -i 's/\r$//' /usr/local/bin/start-nginx.sh
RUN chmod +x /usr/local/bin/start-nginx.sh

CMD ["/bin/sh", "/usr/local/bin/start-nginx.sh"]
