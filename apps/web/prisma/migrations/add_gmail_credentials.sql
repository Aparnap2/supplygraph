-- Create table for storing Gmail OAuth credentials per organization
-- This enables multi-tenant Gmail integration where each organization
-- connects their own Gmail account for sending emails

CREATE TABLE IF NOT EXISTS gmail_credentials (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key constraint to ensure organization exists
  CONSTRAINT fk_gmail_credentials_organization
    FOREIGN KEY (organization_id)
    REFERENCES "organization"(id)
    ON DELETE CASCADE
);

-- Create index for faster lookups by organization
CREATE INDEX IF NOT EXISTS idx_gmail_credentials_org_id ON gmail_credentials(organization_id);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_gmail_credentials_email ON gmail_credentials(email);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_gmail_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_gmail_credentials_updated_at
  BEFORE UPDATE ON gmail_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_gmail_credentials_updated_at();

-- Add comment for documentation
COMMENT ON TABLE gmail_credentials IS 'Stores Gmail OAuth credentials for each organization to enable email sending via Gmail API';
COMMENT ON COLUMN gmail_credentials.organization_id IS 'Foreign key to organization table - ensures multi-tenant isolation';
COMMENT ON COLUMN gmail_credentials.email IS 'The Gmail account email address';
COMMENT ON COLUMN gmail_credentials.access_token IS 'OAuth access token for Gmail API (encrypted in production)';
COMMENT ON COLUMN gmail_credentials.refresh_token IS 'OAuth refresh token for obtaining new access tokens (encrypted in production)';
COMMENT ON COLUMN gmail_credentials.expiry_date IS 'When the current access token expires';