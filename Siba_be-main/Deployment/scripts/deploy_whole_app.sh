#! /bin/bash

# Get the latest code changes from the git repositories
cd ~/siba/siba-fe
git switch main
git pull
cd ~/siba/Siba_be
git switch main
git pull

# Start the Docker daemon if it's not running
sudo systemctl start docker

# Stop and remove current containers
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml down
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml down

# Apply new database changes by resetting the database
sudo docker volume rm siba_be_mariadb_data

# Rebuild the new images and start containers
sudo docker compose -f ~/siba/Siba_be/docker-compose-dbbe-deploy.yaml up -d --build
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml up -d --build
