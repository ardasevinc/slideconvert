#!usr/bin/env bash

docker compose --env-file ./apps/slideconvert-backend/.env up --build -d
