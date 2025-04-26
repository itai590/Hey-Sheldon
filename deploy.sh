#!/bin/bash
set -e

echo "🚀 Building and deploying hey-sheldon ..."

echo "🛑 Stopping old containers..."
docker compose down

echo "🏗 Building and Starting containers..."
docker compose up --build -d "$@"
# docker compose build
# docker compose up -d

echo "📜 Showing live logs..."
docker compose logs -f
