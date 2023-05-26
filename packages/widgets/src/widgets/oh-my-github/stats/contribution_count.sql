-- db:oh-my-github
WITH events AS (SELECT id, user_id, created_at
                FROM issues
                UNION ALL
                SELECT id, user_id, created_at
                FROM pull_requests
                UNION ALL
                SELECT id, user_id, created_at
                FROM issue_comments
                UNION ALL
                SELECT id, user_id, created_at
                FROM commit_comments)

SELECT COUNT(*) AS contribution_count
FROM events
       JOIN curr_user ON events.user_id = curr_user.id
