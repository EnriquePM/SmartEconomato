#!/bin/sh
set -e

CERT_DIR="/etc/nginx/certs"
CRT_FILE="$CERT_DIR/localhost.crt"
KEY_FILE="$CERT_DIR/localhost.key"

mkdir -p "$CERT_DIR"

if [ ! -f "$CRT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "[nginx] No TLS cert found. Generating self-signed certificate for localhost..."
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CRT_FILE" \
    -subj "/C=ES/ST=Local/L=Local/O=SmartEconomato/OU=Dev/CN=localhost"
fi

exec nginx -g "daemon off;"
