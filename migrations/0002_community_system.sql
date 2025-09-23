-- Community System for KABridge
-- Posts and Matching Requests functionality

-- Posts table for community discussions
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  title_en TEXT,
  title_ar TEXT,
  content TEXT NOT NULL,
  content_en TEXT,
  content_ar TEXT,
  author_name TEXT NOT NULL,
  author_company TEXT,
  author_country TEXT,
  category TEXT DEFAULT 'general' CHECK(category IN ('general', 'partnership', 'investment', 'technology', 'trade')),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'featured')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Matching requests table
CREATE TABLE IF NOT EXISTS matching_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_name TEXT NOT NULL,
  requester_company TEXT,
  requester_country TEXT NOT NULL,
  business_type TEXT NOT NULL,
  cooperation_purpose TEXT NOT NULL,
  cooperation_purpose_en TEXT,
  cooperation_purpose_ar TEXT,
  target_countries TEXT, -- JSON array of target countries
  target_industries TEXT, -- JSON array of target industries
  budget_range TEXT,
  timeline TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'matched', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments table for posts
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  author_name TEXT NOT NULL,
  author_company TEXT,
  content TEXT NOT NULL,
  content_en TEXT,
  content_ar TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_matching_requests_country ON matching_requests(requester_country);
CREATE INDEX IF NOT EXISTS idx_matching_requests_status ON matching_requests(status);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Insert sample community posts
INSERT OR IGNORE INTO posts (title, title_en, title_ar, content, content_en, content_ar, author_name, author_company, author_country, category, status) VALUES
('사우디 스마트시티 프로젝트 협력사 모집', 'Saudi Smart City Project Partners Needed', 'مطلوب شركاء لمشروع المدينة الذكية السعودية', 
 'NEOM 프로젝트와 관련하여 IoT, AI 기술을 보유한 한국 기업과 협력을 원합니다. 장기적인 파트너십을 구축하고 있습니다.',
 'We are seeking Korean companies with IoT and AI technologies for NEOM project collaboration. Looking for long-term partnerships.',
 'نبحث عن شركات كورية متخصصة في تقنيات إنترنت الأشياء والذكاء الاصطناعي للتعاون في مشروع نيوم والشراكات طويلة المدى',
 'Ahmed Al-Rashid', 'NEOM Development', 'SA', 'partnership', 'featured'),

('UAE 핀테크 시장 진출 성공사례', 'UAE Fintech Market Success Stories', 'قصص نجاح في سوق التكنولوجيا المالية الإماراتية',
 '한국 핀테크 기업들의 UAE 시장 진출 성공사례를 공유합니다. 현지 규제, 파트너십, 마케팅 전략에 대한 실무 경험을 나누어드립니다.',
 'Sharing success stories of Korean fintech companies entering UAE market. Practical insights on local regulations, partnerships, and marketing strategies.',
 'مشاركة قصص نجاح الشركات الكورية في مجال التكنولوجيا المالية في دخول السوق الإماراتية والخبرات العملية في اللوائح المحلية والشراكات',
 'Park Min-Jun', 'Korea Fintech Association', 'KR', 'technology', 'featured'),

('이집트 식품 시장 K-푸드 트렌드', 'K-Food Trends in Egyptian Market', 'اتجاهات الطعام الكوري في السوق المصرية',
 '이집트에서 한류 열풍과 함께 K-푸드에 대한 관심이 높아지고 있습니다. 현지 소비자 선호도와 유통채널에 대해 논의해보겠습니다.',
 'Interest in K-Food is rising in Egypt along with the Korean Wave. Lets discuss local consumer preferences and distribution channels.',
 'يتزايد الاهتمام بالطعام الكوري في مصر مع الموجة الكورية. دعونا نناقش تفضيلات المستهلكين المحليين وقنوات التوزيع',
 'Mahmoud Hassan', 'Egyptian Food Importers', 'EG', 'trade', 'active'),

('한국-아랍 투자 기회 세미나', 'Korea-Arab Investment Opportunities Seminar', 'ندوة فرص الاستثمار الكورية العربية',
 '다음 달 서울에서 개최되는 한국-아랍 투자 세미나에 관심있는 기업들의 참여를 기다립니다. 양국 간 투자 기회를 모색해보겠습니다.',
 'Inviting interested companies to join the Korea-Arab Investment Seminar in Seoul next month. Exploring bilateral investment opportunities.',
 'ندعو الشركات المهتمة للانضمام إلى ندوة فرص الاستثمار الكورية العربية في سيول الشهر القادم لاستكشاف الفرص الاستثمارية المتبادلة',
 'Kim So-Young', 'Korea Investment Corporation', 'KR', 'investment', 'active');

-- Insert sample matching requests  
INSERT OR IGNORE INTO matching_requests (requester_name, requester_company, requester_country, business_type, cooperation_purpose, cooperation_purpose_en, cooperation_purpose_ar, target_countries, target_industries, budget_range, timeline, contact_email, status, priority) VALUES
('Abdullah Al-Mansouri', 'Dubai Tech Hub', 'AE', 'Technology Partnership', 
 'AI 및 블록체인 기술을 활용한 스마트시티 솔루션 개발을 위해 한국 기업과 협력하고 싶습니다.',
 'Looking to partner with Korean companies for smart city solutions using AI and blockchain technology.',
 'نبحث عن شراكة مع الشركات الكورية لحلول المدن الذكية باستخدام الذكاء الاصطناعي وتقنية البلوك تشين',
 '["KR"]', '["technology"]', '$1M - $5M', '6-12 months', 'abdullah.mansouri@dubaitech.ae', 'active', 'high'),

('Sarah Kim', 'Global Beauty Solutions', 'KR', 'Market Expansion',
 '중동 지역 K-뷰티 시장 진출을 위한 현지 유통 파트너를 찾고 있습니다. 할랄 인증 제품으로 확장 계획 중입니다.',
 'Seeking local distribution partners for K-beauty market entry in Middle East. Planning expansion with Halal-certified products.',
 'نبحث عن شركاء توزيع محليين لدخول سوق مستحضرات التجميل الكورية في الشرق الأوسط مع منتجات حاصلة على شهادة حلال',
 '["SA", "AE", "EG"]', '["retail"]', '$500K - $2M', '3-6 months', 'sarah.kim@globalbeauty.kr', 'active', 'normal'),

('Mohamed El-Sharif', 'Cairo Construction', 'EG', 'Technology Transfer',
 '건설 자동화 및 스마트 빌딩 기술 도입을 위해 한국 건설 기술 기업과의 기술 이전 협약을 원합니다.',
 'Seeking technology transfer agreements with Korean construction tech companies for automation and smart building technologies.',
 'نسعى لاتفاقيات نقل التكنولوجيا مع شركات التكنولوجيا الإنشائية الكورية للأتمتة وتقنيات المباني الذكية',
 '["KR"]', '["construction", "technology"]', '$2M - $10M', '12-18 months', 'mohamed.elsharif@cairoconst.eg', 'active', 'high');