#!/bin/bash

# Database backup script
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
BACKUP_FILE="$BACKUP_DIR/fitlifetracker_$TIMESTAMP.sql"

echo "Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "Backup completed: ${BACKUP_FILE}.gz"

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "fitlifetracker_*.sql.gz" -mtime +7 -delete

echo "Old backups cleanup completed"