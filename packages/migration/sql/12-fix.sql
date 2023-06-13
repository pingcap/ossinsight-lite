ALTER TABLE library_items
  MODIFY visibility VARCHAR(31) NOT NULL DEFAULT 'public';

INSERT INTO ossinsight_lite_admin.library_items (id, widget_name, properties, visibility)
VALUES ('db/sql-1686650509966', 'db/sql',
        '{"currentDb": "oh-my-github", "showBorder": true, "sql": "WITH common AS (SELECT DATE_ADD(NOW(), INTERVAL -3 MONTH) AS recent_days),\\n     activities AS (SELECT repo_id, user_id, id AS _id, ''issue'' AS type\\n                    FROM issues\\n                    WHERE created_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, id AS _id, ''pr'' AS type\\n                    FROM pull_requests\\n                    WHERE created_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, starred_repos.repo_id AS _id, ''star'' AS type\\n                    FROM starred_repos\\n                    WHERE starred_at > (SELECT recent_days FROM common)\\n                    UNION\\n                    SELECT repo_id, user_id, id AS _id, ''issue_comment'' AS type\\n                    FROM issue_comments\\n                    WHERE created_at > (SELECT recent_days FROM common))\\nSELECT IFNULL(CONCAT(r.owner, ''/'', r.name), ''(unknown)'') AS repo,\\n       COUNT(*)                                          AS activities\\nFROM activities a\\n          JOIN repos r ON a.repo_id = r.id\\nWHERE a.user_id = (SELECT id FROM curr_user)\\nGROUP BY 1 ORDER BY 2 DESC\\nLIMIT 5", "title": "Currently working on", "visualize": {"title": "Untitled", "type": "chart:bar", "x": {"field": "activities", "label": "activities", "type": "value"}, "y": {"field": "repo", "label": "repo", "type": "category"}}}',
        'public');