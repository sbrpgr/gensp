-- KABridge 플랫폼 시드 데이터

-- 테스트 사용자 계정
INSERT OR IGNORE INTO users (id, email, password_hash, company_name, country, language) VALUES 
  (1, 'samsung@example.com', 'hashed_password_1', '삼성전자', 'korea', 'ko'),
  (2, 'lg@example.com', 'hashed_password_2', 'LG전자', 'korea', 'ko'),
  (3, 'hyundai@example.com', 'hashed_password_3', '현대자동차', 'korea', 'ko'),
  (4, 'aramco@example.com', 'hashed_password_4', 'Saudi Aramco', 'saudi_arabia', 'ar'),
  (5, 'emirates@example.com', 'hashed_password_5', 'Emirates Group', 'uae', 'en'),
  (6, 'adnoc@example.com', 'hashed_password_6', 'ADNOC', 'uae', 'en');

-- 테스트 기업 프로필
INSERT OR IGNORE INTO companies (id, user_id, company_name, company_name_en, business_type, industry, company_size, founded_year, country, city, description, main_products, technologies, cooperation_types, cooperation_regions, status) VALUES 
  (1, 1, '삼성전자', 'Samsung Electronics', 'manufacturer', 'ict', 'large', 1969, 'korea', 'Suwon', 
   '글로벌 전자제품 제조업체', 
   '["스마트폰", "반도체", "디스플레이", "가전제품"]',
   '["5G", "AI", "IoT", "반도체 기술"]',
   '["export", "joint_venture", "licensing"]',
   '["middle_east", "africa"]', 'active'),
   
  (2, 2, 'LG전자', 'LG Electronics', 'manufacturer', 'ict', 'large', 1958, 'korea', 'Seoul',
   '혁신적인 가전제품과 IT 솔루션 제조업체',
   '["가전제품", "에어컨", "스마트 TV", "배터리"]',
   '["스마트홈", "에너지 저장", "전기차 배터리"]',
   '["export", "partnership", "investment"]',
   '["middle_east", "north_africa"]', 'active'),
   
  (3, 3, '현대자동차', 'Hyundai Motor Company', 'manufacturer', 'automotive', 'large', 1967, 'korea', 'Seoul',
   '글로벌 자동차 제조업체',
   '["승용차", "상용차", "친환경차", "수소차"]',
   '["전기차 기술", "수소연료전지", "자율주행"]',
   '["export", "joint_venture", "partnership"]',
   '["middle_east", "gcc"]', 'active'),
   
  (4, 4, 'Saudi Aramco', 'Saudi Aramco', 'manufacturer', 'energy', 'large', 1933, 'saudi_arabia', 'Dhahran',
   'World largest oil and gas company',
   '["Crude Oil", "Natural Gas", "Petrochemicals", "Refining"]',
   '["Drilling Technology", "Refining", "Petrochemicals", "Carbon Capture"]',
   '["import", "joint_venture", "licensing"]',
   '["korea", "asia"]', 'active'),
   
  (5, 5, 'Emirates Group', 'Emirates Group', 'service', 'other', 'large', 1985, 'uae', 'Dubai',
   'Aviation and travel services company',
   '["Aviation", "Ground Services", "Catering", "Engineering"]',
   '["Aviation Technology", "Digital Services", "Logistics"]',
   '["import", "partnership", "joint_venture"]',
   '["korea", "asia"]', 'active'),
   
  (6, 6, 'ADNOC', 'Abu Dhabi National Oil Company', 'manufacturer', 'energy', 'large', 1971, 'uae', 'Abu Dhabi',
   'Leading oil and gas company in UAE',
   '["Oil Production", "Gas Processing", "Petrochemicals", "Renewable Energy"]',
   '["Enhanced Oil Recovery", "Gas Processing", "Renewable Energy", "Smart Oilfield"]',
   '["import", "joint_venture", "licensing", "investment"]',
   '["korea", "asia", "global"]', 'active');

-- 테스트 협력 요청
INSERT OR IGNORE INTO cooperation_requests (id, sender_id, receiver_id, cooperation_type, subject, message, status) VALUES 
  (1, 1, 4, 'export', '5G 통신장비 수출 협력 제안', 
   '안녕하세요. 삼성전자에서 5G 통신장비 및 솔루션 수출에 관심이 있어 연락드립니다. 귀하의 디지털 전환 프로젝트에 도움이 될 수 있을 것 같습니다.', 
   'pending'),
   
  (2, 3, 5, 'partnership', '친환경 모빌리티 솔루션 파트너십', 
   '현대자동차의 전기차 및 수소차 기술을 활용한 중동 지역 친환경 모빌리티 사업 파트너십을 제안합니다.', 
   'accepted'),
   
  (3, 4, 2, 'joint_venture', 'Energy Storage System Joint Venture',
   'We are interested in establishing a joint venture for energy storage systems using LG battery technology for our renewable energy projects.',
   'pending');

-- 테스트 메시지
INSERT OR IGNORE INTO messages (id, cooperation_request_id, sender_company_id, receiver_company_id, message) VALUES 
  (1, 2, 3, 5, '파트너십 제안에 대해 더 자세한 논의를 위한 화상 미팅을 제안드립니다.'),
  (2, 2, 5, 3, 'Thank you for the proposal. We are very interested and would like to schedule a meeting next week.');

-- 테스트 즐겨찾기
INSERT OR IGNORE INTO favorites (company_id, favorited_company_id) VALUES 
  (1, 4),
  (1, 5),
  (4, 1),
  (4, 2),
  (3, 6);