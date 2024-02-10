-- Custom SQL migration file, put you code below! --
CREATE UNIQUE INDEX IF NOT EXISTS users_username_ci_idx ON users ((LOWER(username)));