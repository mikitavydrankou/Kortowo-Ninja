#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${DB_NAME:-kortowo}"
DB_USER="${DB_USER:-kortowo}"
DB_PASS="${DB_PASS:-kortowo}"

mysql --defaults-file=/etc/mysql/debian.cnf <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';
CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';
FLUSH PRIVILEGES;
SQL

echo "MySQL schema '${DB_NAME}' is ready for '${DB_USER}'."
