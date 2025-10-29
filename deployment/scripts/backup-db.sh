#!/bin/bash
# Database backup script for AthLink

echo "💾 Creating database backup..."

# Get current timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="athlink_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p ../backup

# Export database
echo "📤 Exporting database to ${BACKUP_FILE}..."
pg_dump $DATABASE_URL > ../backup/${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo "✅ Database backup created: backup/${BACKUP_FILE}"
    
    # Compress backup
    gzip ../backup/${BACKUP_FILE}
    echo "🗜️ Backup compressed: backup/${BACKUP_FILE}.gz"
else
    echo "❌ Database backup failed!"
    exit 1
fi

echo "🎉 Backup process complete!"
