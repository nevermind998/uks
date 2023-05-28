#!/bin/bash

RETRIES=10
export PGPASSWORD=123

until psql -h db -U postgres -d uks_database -c "select 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
    echo "Waiting for postgres, $((RETRIES--)) remaining attempts"
    sleep 1
done
