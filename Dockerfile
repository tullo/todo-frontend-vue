FROM node:alpine as builder
USER node
WORKDIR /home/node
COPY . .
RUN set -eux; yarn -s

FROM nginx:1.15.8-alpine
RUN apk add --no-cache tini
WORKDIR /usr/share/nginx/html
COPY --from=builder /home/node .
COPY entrypoint.sh /usr/local/bin/
RUN ln -s usr/local/bin/entrypoint.sh /
RUN rm package.json yarn.lock && rm -r .cache
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget -q --spider --tries=1 localhost/index.html || false
ENTRYPOINT ["tini", "--", "entrypoint.sh"]