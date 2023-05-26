-- db:oh-my-github
SELECT SUM(additions) AS code_additions
FROM pull_requests
       JOIN curr_user ON pull_requests.user_id = curr_user.id