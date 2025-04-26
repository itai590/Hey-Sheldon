#!/bin/bash
set -e

TAG=$(date +"%d%b%y_%H%M")
export TAG=$TAG

echo "🧹 Cleaning old containers if exist..."
docker rm -f hey-sheldon-server || true
docker rm -f hey-sheldon-client || true

echo "🛑 Stopping old containers..."
docker compose down

echo "🏗 Building containers..."
docker compose build

echo " 🏷️ Tagging hey-sheldon-server image with tag $TAG..."
docker tag hey-sheldon-server:latest hey-sheldon-server:"$TAG"

echo "🚀 Starting containers..."
docker compose up -d

echo "📜 Showing live logs..."
docker compose logs -f
