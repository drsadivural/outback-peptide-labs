#!/usr/bin/env sh
# Production start script for the Medusa backend on Railway.
#
# Medusa's production artifact lives in `.medusa/server` after `medusa build`.
# We must (1) run database migrations, then (2) start the server from that
# compiled directory. This script is the container start command.
#
# Railway injects DATABASE_URL, REDIS_URL and PORT at runtime. medusa-config.ts
# reads REDIS_URL to enable the Redis-backed modules; `medusa start` binds to
# PORT automatically.
set -e

# The build output is created by `medusa build` at <repo>/backend/.medusa/server.
# When Railway's Root Directory is `backend`, the working dir is that folder.
cd "$(dirname "$0")/.."

if [ ! -d ".medusa/server" ]; then
  echo "ERROR: .medusa/server not found. Did the build step (npm run build) run?" >&2
  exit 1
fi

cd .medusa/server

# Install production node_modules for the compiled server if they are not
# already present (Medusa's build copies package.json into .medusa/server).
if [ ! -d "node_modules" ]; then
  echo "Installing production dependencies in .medusa/server..."
  npm install --omit=dev
fi

echo "Running database migrations..."
npx medusa db:migrate

echo "Starting Medusa server..."
exec npx medusa start
