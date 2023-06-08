-- db:oh-my-github
WITH languages AS (
    SELECT language, COUNT(*) as count
    FROM pull_requests pr
    JOIN repos r on pr.repo_id = r.id
    WHERE pr.user_id = (SELECT id FROM curr_user LIMIT 1) AND r.language IS NOT NULL
    GROUP BY language
    ORDER BY count DESC
), total AS (
    SELECT SUM(count) as total FROM languages
)
SELECT language, count, ROUND(count * 100.0 / total, 2) as precentage
FROM languages, total
ORDER BY count DESC