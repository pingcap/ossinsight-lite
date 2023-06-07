CREATE TABLE site_accounts
(
  username VARCHAR(255) PRIMARY KEY NOT NULL,
  password CHAR(72)                 NOT NULL
);

INSERT INTO site_accounts(username, password)
VALUES ('admin', :env_INITIAL_PASSWORD)
