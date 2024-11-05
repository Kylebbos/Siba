#! /bin/bash

cd ~/siba/siba-fe
git switch main
git pull

sudo systemctl start docker
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml down
sudo docker compose -f ~/siba/siba-fe/docker-compose-fe-nginx.yaml up -d --build
