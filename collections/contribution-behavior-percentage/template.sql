-- db:oh-my-github
WITH contributions_group_by_type AS (
    SELECT COUNT(*) AS cnt, 'Issues' AS type
    FROM issues
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
    UNION ALL
    SELECT COUNT(*) AS cnt, 'Pull requests' AS type
    FROM pull_requests
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
    UNION ALL
    SELECT COUNT(*) AS cnt, 'Issue comments' AS type
    FROM issue_comments
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
    UNION ALL
    SELECT COUNT(*) AS cnt, 'Commit comments' AS type
    FROM commit_comments
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
), contributions_group_by_all AS (
    SELECT SUM(cgt.cnt) AS cnt FROM contributions_group_by_type cgt
)
SELECT
    cgt.type AS event_type,
    cgt.cnt AS contributions,
    ROUND(cgt.cnt / cga.cnt * 100, 2) AS precentage
FROM contributions_group_by_type cgt, contributions_group_by_all cga
;