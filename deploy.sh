#!/bin/bash
set -e

echo "🚀 Building and deploying hey-sheldon ..."

UNAME_OUT="$(uname -s)"

case "${UNAME_OUT}" in
    Linux*)  export CONFIG_PATH="/home/pi/Sheldon/config.json";;
    Darwin*) export CONFIG_PATH="$HOME/Documents/Offline-Repos/Hey-Sheldon/config.json";;
    *)       echo "❌ Unsupported OS: ${UNAME_OUT}" && exit 1;;
esac
echo "🛠  Using CONFIG_PATH=$CONFIG_PATH"

# Ensure config.json file exists
if [ ! -f "$CONFIG_PATH" ]; then
    echo '{}' > "$CONFIG_PATH"
    echo "🛠 Created missing config.json at $CONFIG_PATH"
fi

echo "🛑 Stopping old containers..."
docker compose down

echo "🏗 Building and Starting containers..."
docker compose up --build -d "$@"
# docker compose build
# docker compose up -d

echo "📜 Showing live logs..."
docker compose logs -f
