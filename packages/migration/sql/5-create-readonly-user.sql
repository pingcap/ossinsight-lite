DROP USER IF EXISTS '${readonly_username}'@'%';

CREATE USER '${readonly_username}'@'%' IDENTIFIED BY '${READONLY_PASSWORD}';

GRANT SELECT, SHOW DATABASES, SHOW VIEW ON *.* TO '${readonly_username}'@'%';

FLUSH PRIVILEGES;
