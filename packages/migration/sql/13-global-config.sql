CREATE TABLE site_config
(
  name  VARCHAR(255) NOT NULL PRIMARY KEY,
  value JSON         NOT NULL
);

INSERT INTO site_config(name, value)
VALUES ('security.enable-public-data-access', 'false'),
       ('security.jwt.secret', JSON_QUOTE(TO_BASE64(RANDOM_BYTES(32)))),
       ('security.initial-password-changed', 'false');
