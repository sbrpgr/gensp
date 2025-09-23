-- Companies data only (no cooperation requests)

INSERT OR REPLACE INTO companies (
  name, name_en, name_ar, country, industry, size, location, location_en, location_ar,
  employees, founded, website, contact_email, 
  description, description_en, description_ar,
  products, products_en, products_ar,
  cooperation_types, cooperation_types_en, cooperation_types_ar,
  target_countries
) VALUES 
('삼성전자', 'Samsung Electronics', 'سامسونغ إلكترونيكس', 'KR', 'ict', 'large', '수원', 'Suwon', 'سوون', 45000, 1969, 'https://www.samsungelectronics.com', 'contact@samsungelectronics.com', '삼성전자는 IT/ICT 분야의 선도 기업으로, 혁신적인 기술과 우수한 품질의 제품 및 서비스를 제공합니다.', 'Samsung Electronics is a leading company in the IT/ICT sector, providing innovative technology and high-quality products and services.', 'سامسونغ إلكترونيكس هي شركة رائدة في قطاع تكنولوجيا المعلومات والاتصالات، وتقدم التكنولوجيا المبتكرة والمنتجات والخدمات عالية الجودة.', '스마트폰, IoT기기, 사이버보안, AI솔루션', 'Semiconductors, AI Solutions, IoT Devices, Software', 'الهواتف الذكية, أجهزة إنترنت الأشياء, حلول الذكاء الاصطناعي, البرمجيات', '수출, 합작투자, 기술이전', 'Export, Joint Venture, Technology Transfer', 'التصدير, المشروع المشترك, نقل التكنولوجيا', 'SA, AE, QA');