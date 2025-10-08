FROM node:22-alpine as builder
USER node
WORKDIR /home/node
COPY . .
# -s (silent) skip yarn console logs
RUN set -eux; yarn -s

FROM nginx:1.29.2-alpine
RUN apk add --no-cache tini
WORKDIR /usr/share/nginx/html
COPY --from=builder /home/node .
RUN mv entrypoint.sh /usr/local/bin/ \
  && rm package.json yarn.lock && rm -r .cache
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -q --spider --tries=1 localhost/index.html || false
ENV VUE_APP_BACKEND_HOST=http://todomvc.go:8080/todos/
ENTRYPOINT ["tini", "--", "entrypoint.sh"]