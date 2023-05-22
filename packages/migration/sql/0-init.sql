CREATE DATABASE IF NOT EXISTS `ossinsight_lite_admin`;

USE `ossinsight_lite_admin`;

CREATE TABLE _migrations
(
  name        VARCHAR(255) PRIMARY KEY NOT NULL,
  migrated_at DATETIME                 NOT NULL DEFAULT CURRENT_TIMESTAMP()
);
