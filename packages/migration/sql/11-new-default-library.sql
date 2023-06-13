DELETE
FROM dashboard_items
WHERE TRUE;

DELETE
FROM library_items
WHERE TRUE;

DELETE
FROM dashboards
WHERE TRUE;

INSERT INTO dashboards (name, properties, visibility)
VALUES ('default', '{"layout": {"gap": 0, "size": [] }}', 'public');

INSERT INTO library_items (id, widget_name, properties, visibility)
VALUES
  -- remote sql
  ('contribution-behavior-percentage', 'db/sql/remote',
   '{"title": "Contribution behavior percentage", "branch": "main", "name": "contribution-behavior-percentage", "owner": "pingcap", "repo": "ossinsight-lite"}',
   'public'),
  ('contribution-monthly', 'db/sql/remote',
   '{"title": "Contribution monthly", "branch": "main", "name": "contribution-monthly", "owner": "pingcap", "repo": "ossinsight-lite"}',
   'public'),
  ('contribution-most-used-languages', 'db/sql/remote',
   '{"title": "Contribution languages", "branch": "main", "name": "contribution-most-used-languages", "owner": "pingcap", "repo": "ossinsight-lite"}',
   'public'),
  ('contribution-pull-request-size-history', 'db/sql/remote',
   '{"title": "Contribution PR size history", "branch": "main", "name": "contribution-pull-request-size-history", "owner": "pingcap", "repo": "ossinsight-lite"}',
   'public'),
  ('contribution-time-distribution', 'db/sql/remote',
   '{"title": "Contribution time distribution", "branch": "main", "name": "contribution-time-distribution", "owner": "pingcap", "repo": "ossinsight-lite"}',
   'public'),
  ('repository-issues-monthly', 'db/sql/remote',
   '{"title": "Repository issues monthly", "branch": "main", "name": "repository-issues-monthly", "owner": "pingcap", "repo": "ossinsight-lite"}',
   'public'),
  ('repository-star-history', 'db/sql/remote',
   '{"title": "Repository star history", "branch": "main", "name": "repository-star-history", "owner": "pingcap", "repo": "ossinsight-lite"}',
   'public'),
  -- basic
  ('oh-my-github/avatar', 'oh-my-github/avatar', '{}', 'public'),
  ('oh-my-github/username', 'oh-my-github/username', '{}', 'public'),
  ('oh-my-github/bio', 'oh-my-github/bio', '{}', 'public'),
  -- ossinsight
  ('ossinsight/total-events', 'ossinsight/total-events', '{}', 'public');

INSERT INTO library_items (id, widget_name, properties, visibility)
VALUES ('about-this-page', 'markdown',
        '{"markdown": "### About This Page\\n\\n👋 Hi developers, this is my custom dashboard created using [OSSInsight Lite](https://github.com/pingcap/ossinsight-lite).\\n\\nIt summarizes my activities on GitHub through various widgets and allows me to track the open-source projects that interest me.\\n\\n#### Build your own dashboard\\n\\n- Step 1. 🍴Fork the pingcap/ossinsight-lite repoistory\\n\\n- Step 2. ⚙️Setup the data pipeline and deploy the project to Vercel\\n\\n- Step 3. 🎨Add widgets and custom your dashboard\\n\\n[See details](https://github.com/pingcap/ossinsight-lite#how-to-deploy-your-own-10mins)", "title": "About This Page"}',
        'public');
