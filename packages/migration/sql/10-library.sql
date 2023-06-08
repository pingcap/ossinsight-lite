INSERT INTO library_items (id, widget_name, properties)
VALUES ('oh-my-github/avatar', 'oh-my-github/avatar', '{}'),
       ('oh-my-github/username', 'oh-my-github/username', '{}'),
       ('oh-my-github/bio', 'oh-my-github/bio', '{}');

DELETE
FROM dashboard_items
WHERE item_id LIKE 'oh-my-github/me%';
DELETE
FROM library_items
WHERE widget_name = 'oh-my-github/me';
