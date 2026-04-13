-- Supabase/PostgreSQL schema for Portfolio API
-- Run in Supabase SQL Editor before switching API to DB_DIALECT=postgres

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  status SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  demo_url VARCHAR(500),
  github_url VARCHAR(500),
  tags VARCHAR(500),
  category VARCHAR(100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  publish_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_sections (
  id BIGSERIAL PRIMARY KEY,
  section VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255),
  content TEXT,
  image VARCHAR(500),
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_sections_set_updated_at ON content_sections;
CREATE TRIGGER content_sections_set_updated_at
BEFORE UPDATE ON content_sections
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS feature_boxes (
  id BIGSERIAL PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  label VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS feature_boxes_set_updated_at ON feature_boxes;
CREATE TRIGGER feature_boxes_set_updated_at
BEFORE UPDATE ON feature_boxes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  user_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id BIGINT,
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_log(created_at);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100) DEFAULT 'Zap',
  price VARCHAR(100) NOT NULL,
  delivery_time VARCHAR(100),
  description TEXT NOT NULL,
  features TEXT DEFAULT '[]',
  revisions VARCHAR(50),
  is_popular SMALLINT DEFAULT 0,
  is_active SMALLINT DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  color VARCHAR(100) DEFAULT 'from-blue-500 to-cyan-500',
  border_color VARCHAR(100) DEFAULT 'border-blue-500/30',
  bg_color VARCHAR(100) DEFAULT 'bg-blue-500/10',
  icon_color VARCHAR(100) DEFAULT 'text-blue-400',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS services_set_updated_at ON services;
CREATE TRIGGER services_set_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  company VARCHAR(255),
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT NOT NULL,
  project_type VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: starter admin user (replace password hash before using in production)
-- INSERT INTO users (email, nickname, password, role, status)
-- VALUES ('admin@example.com', 'admin_user', '$2b$10$replace_this_hash', 'admin', 1)
-- ON CONFLICT (email) DO NOTHING;
