#!/bin/bash

echo "🚀 Starting FitLifeTracker Backend..."
echo "📊 Environment: ${NODE_ENV:-development}"

# Set default environment if not set
export NODE_ENV=${NODE_ENV:-development}

# Wait a moment for database to be ready
echo "⏳ Initializing application..."

# Run database sync in development mode automatically
if [ "$NODE_ENV" = "development" ] || [ "$RUN_DB_SYNC" = "true" ]; then
    echo "🔄 Running database synchronization..."
    node -e "
        import('./src/models/sync.js').then(module => {
            module.default().then(() => {
                console.log('✅ Database sync completed');
            }).catch(error => {
                console.error('❌ Database sync failed:', error.message);
                console.log('⚠️  Continuing without database sync...');
            });
        }).catch(error => {
            console.error('❌ Failed to load sync module:', error.message);
        });
    "
else
    echo "⏭️  Database sync skipped (not in development mode and RUN_DB_SYNC not true)"
fi

# Start the application
echo "🎯 Starting Node.js application..."
exec node server.js