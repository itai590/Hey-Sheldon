#!/bin/bash
set -e

TAG="v$(date +%Y%m%d%H%M%S)"
export TAG=$TAG

echo "🚀 Building and deploying hey-sheldon with tag $TAG..."

echo "🛑 Stopping old containers..."
docker compose down

echo "🏗 Building and Starting containers..."
docker compose build --build-arg TAG="$TAG"
docker compose up -d

echo "📜 Showing live logs..."
docker compose logs -f
