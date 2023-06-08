-- db:oh-my-github
WITH stars AS (
    SELECT
        repo_id,
        sr.starred_at AS starred_at,
        COUNT(*) OVER (PARTITION BY repo_id ORDER BY sr.starred_at) AS accumulated_stars
    FROM
        starred_repos sr
    WHERE
        repo_id IN (SELECT id FROM repos)
), repo_total_stars AS (
   SELECT repo_id, COUNT(*) AS total_stars
   FROM stars
   GROUP BY repo_id
), stars_sampling AS (
    (
        SELECT
            s.repo_id,
            s.starred_at AS time,
            s.accumulated_stars AS stars
        FROM stars s
        JOIN repo_total_stars rts ON s.repo_id = rts.repo_id
        WHERE
            s.accumulated_stars % ROUND(rts.total_stars / 16, 0) = 50
            OR s.accumulated_stars = 0
    )
    UNION
    (
        SELECT
            repo_id,
            NOW() AS time,
            total_stars AS stars
        FROM repo_total_stars
        GROUP BY repo_id
    )
)
SELECT
    CONCAT(r.owner, '/', r.name) AS full_name,
    ss.repo_id,
    ss.time,
    ss.stars
FROM
    stars_sampling ss
    JOIN repos r ON ss.repo_id = r.id
ORDER BY
    full_name,
    time
;