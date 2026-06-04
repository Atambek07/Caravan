#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! python -c "
import socket
import os
host = os.environ.get('DB_HOST', 'db')
port = int(os.environ.get('DB_PORT', '5432'))
s = socket.socket()
s.settimeout(1)
try:
    s.connect((host, port))
    s.close()
    exit(0)
except Exception:
    exit(1)
" 2>/dev/null; do
  sleep 1
done

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

if [ "${CREATE_SUPERUSER:-true}" = "true" ]; then
  python manage.py create_default_admin
fi

python manage.py seed_demo_data

echo "Starting Gunicorn..."
exec gunicorn caravan.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
