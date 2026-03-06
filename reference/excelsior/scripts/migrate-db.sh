#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  # Use a pattern that handles potential quotes and spaces
  export $(grep -v '^#' .env | xargs)
else
  echo "Error: .env file not found"
  exit 1
fi

# Validate connection strings exist
if [ -z "$DATABASE_URL_OLD" ]; then
  echo "Error: DATABASE_URL_OLD not set in .env"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL not set in .env"
  exit 1
fi

DUMP_FILE="supabase_dump_$(date +%Y%m%d_%H%M%S).bak"

echo "==> Exporting from Supabase..."
# --no-owner and --no-acl are important to avoid permission errors on the target
pg_dump -Fc -v --no-owner --no-acl \
  -d "$DATABASE_URL_OLD" \
  -f "$DUMP_FILE"

echo "==> Importing into Neon..."
# --clean drops existing objects, --if-exists prevents errors if they don't exist
# --no-owner and --no-acl ensure we don't try to create Supabase roles in Neon
pg_restore -v --no-owner --no-acl --clean --if-exists \
  -d "$DATABASE_URL" \
  "$DUMP_FILE"

echo "==> Migration complete! Dump file: $DUMP_FILE"

