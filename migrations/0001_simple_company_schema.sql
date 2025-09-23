-- Simple KABridge Company Schema
-- Optimized for 600 companies total

-- Companies table with essential fields only
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_en TEXT,
  name_ar TEXT,
  country TEXT NOT NULL CHECK(country IN ('KR', 'SA', 'AE', 'EG', 'JO', 'LB', 'QA', 'BH', 'KW', 'OM')),
  industry TEXT NOT NULL CHECK(industry IN (
    'technology', 'manufacturing', 'energy', 'healthcare', 
    'finance', 'construction', 'food', 'logistics', 'retail', 'education'
  )),
  location TEXT NOT NULL,
  location_en TEXT,
  location_ar TEXT,
  description TEXT,
  description_en TEXT, 
  description_ar TEXT,
  cooperation_needs TEXT NOT NULL,  -- Simple, direct cooperation needs
  cooperation_needs_en TEXT,
  cooperation_needs_ar TEXT,
  contact_email TEXT,
  website TEXT,
  phone TEXT,
  established_year INTEGER,
  employee_count INTEGER,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Search matching logs (simplified)
CREATE TABLE IF NOT EXISTS search_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  search_query TEXT,
  filter_country TEXT,
  filter_industry TEXT,
  results_count INTEGER,
  search_time DATETIME DEFAULT CURRENT_TIMESTAMP
);