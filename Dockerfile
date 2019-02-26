FROM node:alpine as builder
USER node
WORKDIR /home/node
COPY . .
RUN set -eux; yarn -s

FROM nginx:1.15.8-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /home/node .
RUN rm package.json yarn.lock
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget -q --spider --tries=1 localhost/index.html || false
    