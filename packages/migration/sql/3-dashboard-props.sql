USE `ossinsight_lite_admin`;

ALTER TABLE dashboards
  ADD COLUMN properties JSON NOT NULL;
