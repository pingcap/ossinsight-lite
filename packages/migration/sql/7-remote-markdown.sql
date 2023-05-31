USE ossinsight_lite_admin;

INSERT INTO ossinsight_lite_admin.library_items (id, widget_name, properties)
VALUES ('guide', 'markdown/remote',
        '{"href": "https://raw.githubusercontent.com/634750802/ossinsight-lite/main/README.md"}')
ON DUPLICATE KEY UPDATE properties = '{
  "href": "https://raw.githubusercontent.com/634750802/ossinsight-lite/main/README.md"
}';