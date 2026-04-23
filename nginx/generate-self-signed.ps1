$ErrorActionPreference = "Stop"

$certDir = Join-Path $PSScriptRoot "certs"
if (-not (Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir | Out-Null
}

$crtPath = Join-Path $certDir "localhost.crt"
$keyPath = Join-Path $certDir "localhost.key"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout $keyPath `
  -out $crtPath `
  -subj "/C=ES/ST=Local/L=Local/O=SmartEconomato/OU=Dev/CN=localhost"

Write-Host "Certificado generado en $crtPath"
Write-Host "Clave generada en $keyPath"
