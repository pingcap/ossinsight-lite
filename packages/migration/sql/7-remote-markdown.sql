INSERT INTO library_items (id, widget_name, properties)
VALUES ('guide', 'markdown/remote',
        '{"href": "https://raw.githubusercontent.com/pingcap/ossinsight-lite/main/README.md"}')
ON DUPLICATE KEY UPDATE properties = '{
  "href": "https://raw.githubusercontent.com/pingcap/ossinsight-lite/main/README.md"
}';