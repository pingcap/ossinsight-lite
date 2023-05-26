-- db:oh-my-github
WITH events AS (SELECT id, user_id, created_at, 'issue' AS type
                FROM issues
                UNION ALL
                SELECT id, user_id, created_at, 'pull_request' AS type
                FROM pull_requests
                UNION ALL
                SELECT id, user_id, created_at, 'issue_comment' AS type
                FROM issue_comments
                UNION ALL
                SELECT id, user_id, created_at, 'commit_comment' AS type
                FROM commit_comments)

SELECT DATE_FORMAT(events.created_at, '%Y-%m-01') AS month, type, COUNT(*) AS cnt
FROM events
       JOIN curr_user ON events.user_id = curr_user.id
GROUP BY 1, 2
ORDER BY 1 ASC
