#!/bin/bash
set -e

TAG=$(date +"%d%b%y_%H%M.%S")
export TAG=$TAG

echo -e "🧹 Cleaning old containers if exist..."
docker rm -f hey-sheldon-certbot || true
docker rm -f hey-sheldon-backend || true
docker rm -f hey-sheldon-frontend || true


echo -e "\n🛑 Stopping old containers..."
docker compose down

echo -e "\n🏗 Building containers..."
# docker compose build --no-cache
docker compose build


echo -e "\n🏷️ Tagging hey-sheldon-backend image with tag $TAG..."
docker tag hey-sheldon-backend:latest hey-sheldon-backend:"$TAG"
docker tag hey-sheldon-frontend:latest hey-sheldon-frontend:"$TAG"

echo -e "\n🚀 Starting containers..."
docker compose up -d

echo -e "\n📜 Showing live logs..."
docker compose logs -f
