-- Portal sessions table for persistent session storage
-- This replaces in-memory sessions which don't work in serverless environments

CREATE TABLE IF NOT EXISTS portal_sessions (
  token TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  ip TEXT
);

-- Enable RLS - sessions are only managed server-side via service role
ALTER TABLE portal_sessions ENABLE ROW LEVEL SECURITY;

-- No policies needed - service role bypasses RLS
-- Anon/authenticated should never access sessions directly

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_portal_sessions_expires_at ON portal_sessions(expires_at);