-- db:oh-my-github
WITH events AS (SELECT id, user_id, repo_id
                FROM issues
                UNION ALL
                SELECT id, user_id, repo_id
                FROM pull_requests
                UNION ALL
                SELECT id, user_id, repo_id
                FROM issue_comments
                UNION ALL
                SELECT id, user_id, repo_id
                FROM commit_comments)

SELECT COUNT(DISTINCT repo_id) AS contributed_repos
FROM events
       JOIN curr_user ON events.user_id = curr_user.id