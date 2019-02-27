#!/bin/sh

# Replace env var in backend.js files
echo "Replacing environment variable in backend.js"
envsubst '$VUE_APP_BACKEND_HOST' < js/backend.js > js/backend.js

echo "Starting Nginx"
#exec "$@"
nginx -g 'daemon off;'