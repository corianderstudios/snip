INSERT INTO users (username, password_hash)
VALUES ('guest', 'dev-only')
ON CONFLICT (username) DO NOTHING;