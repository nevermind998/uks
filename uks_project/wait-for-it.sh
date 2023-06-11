#!/bin/bash

host="db"
port="5432"
timeout="${3:-15}"

wait_for_postgres() {
  while !</dev/tcp/"$host"/"$port"; do
    echo "Waiting for PostgreSQL to become available..."
    sleep 1
    timeout=$((timeout-1))
    if [[ "$timeout" -eq 0 ]]; then
      echo "Timeout occurred. PostgreSQL is not available."
      exit 1
    fi
  done
  echo "PostgreSQL is now available."
}

wait_for_postgres
