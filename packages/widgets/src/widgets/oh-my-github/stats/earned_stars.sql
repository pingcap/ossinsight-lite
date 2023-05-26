-- db:oh-my-github
SELECT SUM(stargazer_count) AS earned_stars
FROM repos
       JOIN curr_user ON repos.user_id = curr_user.id
WHERE repos.is_fork = FALSE
  AND repos.is_private = FALSE
