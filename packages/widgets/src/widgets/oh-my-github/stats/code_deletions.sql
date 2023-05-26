-- db:oh-my-github
SELECT SUM(deletions) AS code_deletions
FROM pull_requests
       JOIN curr_user ON pull_requests.user_id = curr_user.id
