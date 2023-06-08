-- db:oh-my-github
WITH monthly_issues AS (
    SELECT
        repo_id,
        DATE_FORMAT(created_at, '%Y-%m-01') AS month,
        COUNT(*) AS issues
    FROM
        issues i
    WHERE
        repo_id IN (SELECT id FROM repos)
        AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
    GROUP BY repo_id, month

)
SELECT
    repo_id,
    CONCAT(r.owner, '/', r.name) AS repo_full_name,
    month,
    issues
FROM
    monthly_issues mi
    JOIN repos r ON mi.repo_id = r.id
ORDER BY
    repo_full_name,
    month
;