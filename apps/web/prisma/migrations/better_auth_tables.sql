-- Better Auth tables for user authentication and social providers
-- These tables are required for Better Auth to function properly

-- Users table
CREATE TABLE IF NOT EXISTS user (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table for social providers
CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at INTEGER,
  refresh_token_expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT account_user_id_fkey FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT account_account_id_provider_id_key UNIQUE(account_id, provider_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT session_user_id_fkey FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Verification table for email verification, password reset, etc.
CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS account_user_id_idx ON account(user_id);
CREATE INDEX IF NOT EXISTS session_user_id_idx ON session(user_id);
CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification(identifier);

-- Triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_account_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_verification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_user_updated_at
  BEFORE UPDATE ON user
  FOR EACH ROW
  EXECUTE FUNCTION update_user_updated_at();

CREATE TRIGGER trigger_account_updated_at
  BEFORE UPDATE ON account
  FOR EACH ROW
  EXECUTE FUNCTION update_account_updated_at();

CREATE TRIGGER trigger_session_updated_at
  BEFORE UPDATE ON session
  FOR EACH ROW
  EXECUTE FUNCTION update_session_updated_at();

CREATE TRIGGER trigger_verification_updated_at
  BEFORE UPDATE ON verification
  FOR EACH ROW
  EXECUTE FUNCTION update_verification_updated_at();

-- Comments for documentation
COMMENT ON TABLE user IS 'User accounts for authentication';
COMMENT ON TABLE account IS 'Social provider accounts linked to users (Google, etc.)';
COMMENT ON TABLE session IS 'User sessions for authentication';
COMMENT ON TABLE verification IS 'Verification tokens for email verification, password reset, etc.';

COMMENT ON COLUMN account.provider_id IS 'The OAuth provider (google, github, etc.)';
COMMENT ON COLUMN account.account_id IS 'The user ID from the OAuth provider';
COMMENT ON COLUMN account.access_token IS 'OAuth access token';
COMMENT ON COLUMN account.refresh_token IS 'OAuth refresh token';
COMMENT ON COLUMN account.access_token_expires_at IS 'Unix timestamp when access token expires';
COMMENT ON COLUMN account.refresh_token_expires_at IS 'Unix timestamp when refresh token expires';