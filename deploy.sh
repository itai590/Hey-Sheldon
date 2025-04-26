#!/bin/bash
set -e

TAG=$(date +"%d%b%y_%H%M")
export TAG=$TAG

echo "🚀 Building and deploying hey-sheldon with tag $TAG..."

echo "🛑 Stopping old containers..."
docker compose down

echo "🏗 Building and Starting containers..."
docker compose build --build-arg TAG="$TAG"
docker tag hey-sheldon-server:"$TAG" hey-sheldon-server:latest

docker compose up -d

echo "📜 Showing live logs..."
docker compose logs -f
