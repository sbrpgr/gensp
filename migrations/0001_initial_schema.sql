-- KABridge 플랫폼 초기 데이터베이스 스키마

-- 사용자 테이블 (기업 계정)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL, -- 'korea' or arab country codes
  language TEXT DEFAULT 'ko', -- 'ko', 'ar', 'en'
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'suspended'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기업 프로필 테이블
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  company_name TEXT NOT NULL,
  company_name_en TEXT, -- 영어명
  company_name_ar TEXT, -- 아랍어명
  business_type TEXT NOT NULL, -- 'manufacturer', 'service', 'trading', 'tech', 'construction'
  industry TEXT NOT NULL, -- 'energy', 'construction', 'ict', 'medical', 'automotive', 'food', 'other'
  company_size TEXT NOT NULL, -- 'startup', 'small', 'medium', 'large'
  founded_year INTEGER,
  country TEXT NOT NULL,
  city TEXT,
  address TEXT,
  website TEXT,
  phone TEXT,
  description TEXT, -- 한국어 설명
  description_en TEXT, -- 영어 설명  
  description_ar TEXT, -- 아랍어 설명
  main_products TEXT, -- JSON array of products/services
  technologies TEXT, -- JSON array of technologies
  certifications TEXT, -- JSON array of certifications
  cooperation_types TEXT NOT NULL, -- JSON array: ['export', 'import', 'joint_venture', 'licensing', 'partnership', 'investment']
  cooperation_regions TEXT, -- JSON array of target regions
  logo_url TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'draft', 'suspended'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 협력 요청 테이블
CREATE TABLE IF NOT EXISTS cooperation_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL, -- 요청을 보내는 기업
  receiver_id INTEGER NOT NULL, -- 요청을 받는 기업
  cooperation_type TEXT NOT NULL, -- 'export', 'import', 'joint_venture', etc.
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'withdrawn'
  responded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 메시지 테이블 (기본 메신저 기능)
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cooperation_request_id INTEGER NOT NULL,
  sender_company_id INTEGER NOT NULL,
  receiver_company_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cooperation_request_id) REFERENCES cooperation_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 즐겨찾기 테이블
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  favorited_company_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (favorited_company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(company_id, favorited_company_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_business_type ON companies(business_type);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_cooperation_requests_sender ON cooperation_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_cooperation_requests_receiver ON cooperation_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_cooperation_requests_status ON cooperation_requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_cooperation_request ON messages(cooperation_request_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_company_id, is_read);
CREATE INDEX IF NOT EXISTS idx_favorites_company ON favorites(company_id);