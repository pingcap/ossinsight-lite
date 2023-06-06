-- db:oh-my-github
WITH contributions_group_by_type AS (
    SELECT
        DAYOFWEEK(created_at) - 1 AS dayofweek,
        HOUR(created_at) AS hour,
        COUNT(*) AS cnt,
        'issue' AS type
    FROM issues
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
    GROUP BY dayofweek, hour
    UNION ALL
    SELECT
        DAYOFWEEK(created_at) - 1 AS dayofweek,
        HOUR(created_at) AS hour,
        COUNT(*) AS cnt,
        'pull_requests' AS type
    FROM pull_requests
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
    GROUP BY dayofweek, hour
    UNION ALL
    SELECT
        DAYOFWEEK(created_at) - 1 AS dayofweek,
        HOUR(created_at) AS hour,
        COUNT(*) AS cnt,
        'issue_comments' AS type
    FROM issue_comments
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
    GROUP BY dayofweek, hour
    UNION ALL
    SELECT
        DAYOFWEEK(created_at) - 1 AS dayofweek,
        HOUR(created_at) AS hour,
        COUNT(*) AS cnt,
        'commit_comments' AS type
    FROM commit_comments
    WHERE user_id = (SELECT id FROM curr_user LIMIT 1)
    GROUP BY dayofweek, hour
), contributions_group_by_all AS (
    SELECT dayofweek, hour, SUM(cgt.cnt) AS cnt
    FROM contributions_group_by_type cgt
    GROUP BY dayofweek, hour
    ORDER BY dayofweek, hour
)
SELECT dayofweek, hour, cnt
FROM contributions_group_by_all
;