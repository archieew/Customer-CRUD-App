#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Clear Laravel's caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run database migrations
php artisan migrate --force

# Set permissions for storage and bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Execute the main container command (php-fpm)
exec "$@" 