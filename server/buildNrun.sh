#!/bin/bash
repo_name="hey-sheldon"

# Build
build_id=$(docker inspect $repo_name | jq -r '.[0].RepoTags[0]' | awk -F':' '{print $2}')
set -x
build_id=$((build_id + 1))

docker build -t $repo_name:latest .
docker tag $repo_name:latest "$repo_name:$build_id"

# Post Build
docker stop hey-sheldon-backend || true
docker rm hey-sheldon-backend || true

# Run
# docker run -d --device /dev/snd:/dev/snd --volume /home/pi/Sheldon/config.json:/app/config.json --name hey-sheldon-backend-t4 hey-sheldon:4
docker compose up -d
docker compose logs -f
