FROM caddy:2.8
LABEL authors="gaopuguang"
COPY ./dist /var/www/html
COPY ./Caddyfile /etc/caddy
ENV PORT=8011
ENV PREFIX_PATH="/prod-api"
ENV PROXY="ecs.gpg123.vip:9099"
EXPOSE 8011
