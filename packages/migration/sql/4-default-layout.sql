INSERT INTO dashboards (name, properties)
VALUES ('default', '{"layout": {"gap": 8, "size": [40, 16], "type": "gird:responsive"}}');

INSERT INTO library_items (id, widget_name, properties)
VALUES ('db/sql-1684253466319', 'db/sql',
        '{"currentDb": "oh-my-github", "mode": "visualization", "sql": "SELECT ''Hello OSSInsight Lite!''", "visualize": {"title": "Greeting", "type": "gauge"}}'),
       ('db/sql-1684253471502', 'db/sql',
        '{"currentDb": "oh-my-github", "mode": "visualization", "sql": "SELECT ''Hello OSSInsight Lite!''", "visualize": {"title": "Greeting", "type": "gauge"}}'),
       ('free-editor', 'db/sql',
        '{"currentDb": "oh-my-github", "mode": "editor", "sql": "WITH common AS (SELECT DATE_ADD(NOW(), INTERVAL -3 MONTH) AS recent_days),\\n     activities AS (SELECT repo_id, user_id, id AS _id, ''issue'' AS type\\n                    FROM issues\\n                    WHERE created_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, id AS _id, ''pr'' AS type\\n                    FROM pull_requests\\n                    WHERE created_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, starred_repos.repo_id AS _id, ''star'' AS type\\n                    FROM starred_repos\\n                    WHERE starred_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, id AS _id, ''issue_comment'' AS type\\n                    FROM issue_comments\\n                    WHERE created_at > (SELECT recent_days FROM common))\\nSELECT IFNULL(CONCAT(r.owner, ''/'', r.name), ''(unknown)'') AS repo,\\n       COUNT(*)                                          AS activities\\nFROM activities a\\n         LEFT JOIN repos r ON a.repo_id = r.id\\nWHERE a.user_id = (SELECT id FROM curr_user)\\nGROUP BY 1 ORDER BY 2 DESC", "visualize": {"title": "Untitled", "type": "chart:bar", "x": {"field": "repo", "label": "repo", "type": "category"}, "y": {"field": "activities", "label": "activities", "type": "value"}}}'),
       ('internal:Navigator', 'internal:Navigator', '{}'),
       ('internal:Title', 'internal:Title', '{}'),
       ('oh-my-github/me-1683797454', 'oh-my-github/me', '{}'),
       ('oh-my-github/personal-overview', 'oh-my-github/personal-overview', '{}'),
       ('oh-my-github/stats-1683797498', 'oh-my-github/stats', '{}'),
       ('ossinsight/total-events', 'ossinsight/total-events', '{}'),
       ('recent-focused-on', 'db/sql',
        '{"currentDb": "oh-my-github", "mode": "visualization", "sql": "WITH common AS (SELECT DATE_ADD(NOW(), INTERVAL -3 MONTH) AS recent_days),\\n     activities AS (SELECT repo_id, user_id, id AS _id, ''issue'' AS type\\n                    FROM issues\\n                    WHERE created_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, id AS _id, ''pr'' AS type\\n                    FROM pull_requests\\n                    WHERE created_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, starred_repos.repo_id AS _id, ''star'' AS type\\n                    FROM starred_repos\\n                    WHERE starred_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, id AS _id, ''issue_comment'' AS type\\n                    FROM issue_comments\\n                    WHERE created_at > (SELECT recent_days FROM common))\\nSELECT IFNULL(CONCAT(r.owner, ''/'', r.name), ''(unknown)'') AS repo,\\n       COUNT(*)                                          AS activities\\nFROM activities a\\n         LEFT JOIN repos r ON a.repo_id = r.id\\nWHERE a.user_id = (SELECT id FROM curr_user)\\nGROUP BY 1 ORDER BY 2 DESC", "visualize": {"title": "Currently Working On", "type": "chart:bar", "x": {"field": "activities", "label": "Activities", "type": "value"}, "y": {"field": "repo", "label": "Repo", "type": "category"}}}');

INSERT INTO dashboard_items (dashboard_name, item_id, properties)
VALUES ('default', 'free-editor', '{"rect": [-1, -7, 18, 13]}'),
       ('default', 'oh-my-github/me-1683797454', '{"rect": [-17, -8, 6, 3]}'),
       ('default', 'oh-my-github/personal-overview', '{"rect": [-17, 0, 16, 8]}'),
       ('default', 'oh-my-github/stats-1683797498', '{"rect": [-17, -4, 7, 4]}'),
       ('default', 'ossinsight/total-events', '{"rect": [-14, -6, 4, 2]}'),
       ('default', 'recent-focused-on', '{"rect": [-10, -8, 9, 8]}');