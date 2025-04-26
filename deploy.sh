#!/bin/bash
set -e

TAG=$(date +"%d%b%y_%H%M.%S")
export TAG=$TAG

echo -e "🧹 Cleaning old containers if exist..."
docker rm -f hey-sheldon-server || true
docker rm -f hey-sheldon-client || true

echo -e "\n🛑 Stopping old containers..."
docker compose down

echo -e "\n🏗 Building containers..."
docker compose build server
docker compose build --no-cache client


echo -e "\n🏷️ Tagging hey-sheldon-server image with tag $TAG..."
docker tag hey-sheldon-server:latest hey-sheldon-server:"$TAG"
docker tag hey-sheldon-client:latest hey-sheldon-client:"$TAG"

echo -e "\n🚀 Starting containers..."
docker compose up -d

echo -e "\n📜 Showing live logs..."
docker compose logs -f
