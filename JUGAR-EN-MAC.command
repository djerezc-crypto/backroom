#!/bin/bash
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  No encuentro Node.js instalado en este Mac."
  echo "  Ve a https://nodejs.org , descarga el boton verde que dice \"LTS\","
  echo "  instalalo, y despues vuelve a hacer doble click en este archivo."
  echo ""
  read -p "Presiona Enter para cerrar..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Instalando lo necesario, un momento la primera vez..."
  npm install
  echo ""
fi

LOCAL_IP=""
if command -v ipconfig >/dev/null 2>&1; then
  LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
fi
if [ -z "$LOCAL_IP" ] && command -v hostname >/dev/null 2>&1; then
  LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

echo ""
echo "=============================================================="
echo "  Backrooms Together esta corriendo."
echo ""
echo "  TU juegas en este mismo Mac entrando a:"
echo "      http://localhost:3000"
echo ""
echo "  Tu hermano entra DESDE SU CELULAR (misma wifi de esta casa)"
echo "  escribiendo en su navegador esta direccion:"
echo ""
if [ -n "$LOCAL_IP" ]; then
  echo "      http://$LOCAL_IP:3000"
else
  echo "      (no pude detectar tu IP automaticamente; ve a Preferencias"
  echo "       del Sistema > Red y busca la direccion IP de tu wifi)"
fi
echo ""
echo "  Deja esta ventana abierta mientras juegan. Para cerrar el"
echo "  juego, simplemente cierra esta ventana."
echo "=============================================================="
echo ""

open "http://localhost:3000" >/dev/null 2>&1

node server.js
