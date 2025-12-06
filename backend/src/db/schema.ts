import { pool } from './pool.js';

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  trust_score INTEGER DEFAULT 0,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode VARCHAR(14) NOT NULL,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100),
  ingredients JSONB NOT NULL,
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  nutrition_facts JSONB,
  submitted_by UUID NOT NULL REFERENCES users(id),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_submitted_by ON products(submitted_by);

-- Submissions table (moderation queue)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  barcode VARCHAR(14) NOT NULL,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100),
  ingredients JSONB NOT NULL,
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  nutrition_facts JSONB,
  source_url VARCHAR(500),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending_review',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  preferences JSONB DEFAULT '{}'::JSONB,
  dietary_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  allergens TEXT[] DEFAULT ARRAY[]::TEXT[],
  certification_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Refresh tokens table (for revocation if needed)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
`;

export async function migrate(): Promise<void> {
  try {
    console.log('Running database migrations...');
    await pool.query(schema);
    console.log('✓ Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}
