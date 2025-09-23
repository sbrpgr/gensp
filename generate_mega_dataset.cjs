// KABridge Platform - Mega Dataset Generator (500+ companies)
// 한국-아랍 기업 500개 이상 가상 데이터 생성

const fs = require('fs');

// 한국 기업 기본 데이터
const koreanCompanyBases = [
  // 대기업
  { name: "삼성전자", nameEn: "Samsung Electronics", nameAr: "سامسونغ إلكترونيكس", industry: "ict", size: "large", city: "수원", cityEn: "Suwon", cityAr: "سوون" },
  { name: "LG전자", nameEn: "LG Electronics", nameAr: "إل جي إلكترونيكس", industry: "ict", size: "large", city: "서울", cityEn: "Seoul", cityAr: "سيول" },
  { name: "현대자동차", nameEn: "Hyundai Motor", nameAr: "هيونداي موتور", industry: "automotive", size: "large", city: "서울", cityEn: "Seoul", cityAr: "سيول" },
  { name: "SK하이닉스", nameEn: "SK Hynix", nameAr: "إس كي هاينكس", industry: "ict", size: "large", city: "이천", cityEn: "Icheon", cityAr: "إيتشون" },
  { name: "POSCO", nameEn: "POSCO", nameAr: "بوسكو", industry: "construction", size: "large", city: "포항", cityEn: "Pohang", cityAr: "بوهانغ" },
  { name: "롯데그룹", nameEn: "Lotte Group", nameAr: "مجموعة لوته", industry: "other", size: "large", city: "서울", cityEn: "Seoul", cityAr: "سيول" },
  
  // 중견기업
  { name: "네이버", nameEn: "Naver Corp", nameAr: "نيفر", industry: "ict", size: "medium", city: "분당", cityEn: "Bundang", cityAr: "بوندانغ" },
  { name: "카카오", nameEn: "Kakao Corp", nameAr: "كاكاو", industry: "ict", size: "medium", city: "제주", cityEn: "Jeju", cityAr: "جيجو" },
  { name: "쿠팡", nameEn: "Coupang", nameAr: "كوبانغ", industry: "other", size: "medium", city: "서울", cityEn: "Seoul", cityAr: "سيول" },
  { name: "배달의민족", nameEn: "Baedal Minjok", nameAr: "بايدال مينجوك", industry: "other", size: "medium", city: "서울", cityEn: "Seoul", cityAr: "سيول" },
  
  // 중소기업
  { name: "스마일게이트", nameEn: "Smilegate", nameAr: "سمايل غيت", industry: "ict", size: "small", city: "서울", cityEn: "Seoul", cityAr: "سيول" },
  { name: "넷마블", nameEn: "Netmarble", nameAr: "نت مارب", industry: "ict", size: "small", city: "서울", cityEn: "Seoul", cityAr: "سيول" }
];

// 아랍 기업 기본 데이터  
const arabCompanyBases = [
  // 사우디아라비아
  { name: "Saudi Aramco", nameKo: "사우디 아람코", nameAr: "أرامكو السعودية", industry: "energy", size: "large", city: "Dhahran", cityKo: "다란", cityAr: "الظهران", country: "SA" },
  { name: "SABIC", nameKo: "사빅", nameAr: "سابك", industry: "petrochemical", size: "large", city: "Riyadh", cityKo: "리야드", cityAr: "الرياض", country: "SA" },
  { name: "Al Rajhi Bank", nameKo: "알라지 은행", nameAr: "مصرف الراجحي", industry: "finance", size: "large", city: "Riyadh", cityKo: "리야드", cityAr: "الرياض", country: "SA" },
  { name: "Saudi Telecom", nameKo: "사우디 텔레콤", nameAr: "الاتصالات السعودية", industry: "ict", size: "large", city: "Riyadh", cityKo: "리야드", cityAr: "الرياض", country: "SA" },
  
  // UAE
  { name: "Emirates Group", nameKo: "에미레이츠 그룹", nameAr: "مجموعة الإمارات", industry: "aviation", size: "large", city: "Dubai", cityKo: "두바이", cityAr: "دبي", country: "AE" },
  { name: "ADNOC", nameKo: "아드녹", nameAr: "أدنوك", industry: "energy", size: "large", city: "Abu Dhabi", cityKo: "아부다비", cityAr: "أبوظبي", country: "AE" },
  { name: "Dubai Islamic Bank", nameKo: "두바이 이슬람 은행", nameAr: "بنك دبي الإسلامي", industry: "finance", size: "large", city: "Dubai", cityKo: "두바이", cityAr: "دبي", country: "AE" },
  { name: "Etisalat", nameKo: "에티살랏", nameAr: "اتصالات", industry: "ict", size: "large", city: "Abu Dhabi", cityKo: "아부다비", cityAr: "أبوظبي", country: "AE" },
  
  // 카타르
  { name: "Qatar Airways", nameKo: "카타르 항공", nameAr: "الخطوط الجوية القطرية", industry: "aviation", size: "large", city: "Doha", cityKo: "도하", cityAr: "الدوحة", country: "QA" },
  { name: "Qatar Petroleum", nameKo: "카타르 석유공사", nameAr: "قطر للبترول", industry: "energy", size: "large", city: "Doha", cityKo: "도하", cityAr: "الدوحة", country: "QA" },
  
  // 쿠웨이트
  { name: "Kuwait Petroleum", nameKo: "쿠웨이트 석유공사", nameAr: "مؤسسة البترول الكويتية", industry: "energy", size: "large", city: "Kuwait City", cityKo: "쿠웨이트시티", cityAr: "مدينة الكويت", country: "KW" },
  { name: "National Bank of Kuwait", nameKo: "쿠웨이트 국립은행", nameAr: "بنك الكويت الوطني", industry: "finance", size: "large", city: "Kuwait City", cityKo: "쿠웨이트시티", cityAr: "مدينة الكويت", country: "KW" }
];

// 업종별 제품/서비스
const industryProducts = {
  ict: {
    ko: ["스마트폰", "반도체", "소프트웨어", "클라우드서비스", "AI솔루션", "IoT기기", "빅데이터분석", "사이버보안"],
    en: ["Smartphones", "Semiconductors", "Software", "Cloud Services", "AI Solutions", "IoT Devices", "Big Data Analytics", "Cybersecurity"],
    ar: ["الهواتف الذكية", "أشباه الموصلات", "البرمجيات", "الخدمات السحابية", "حلول الذكاء الاصطناعي", "أجهزة إنترنت الأشياء", "تحليل البيانات الضخمة", "الأمن السيبراني"]
  },
  automotive: {
    ko: ["전기차", "하이브리드차", "자율주행차", "배터리", "충전인프라", "모빌리티서비스"],
    en: ["Electric Vehicles", "Hybrid Cars", "Autonomous Vehicles", "Batteries", "Charging Infrastructure", "Mobility Services"],
    ar: ["السيارات الكهربائية", "السيارات الهجينة", "السيارات ذاتية القيادة", "البطاريات", "البنية التحتية للشحن", "خدمات التنقل"]
  },
  construction: {
    ko: ["스마트빌딩", "친환경건설", "인프라건설", "건설자재", "건설장비", "프로젝트관리"],
    en: ["Smart Buildings", "Green Construction", "Infrastructure", "Construction Materials", "Construction Equipment", "Project Management"],
    ar: ["المباني الذكية", "البناء الأخضر", "البنية التحتية", "مواد البناء", "معدات البناء", "إدارة المشاريع"]
  },
  energy: {
    ko: ["태양광", "풍력", "수소에너지", "에너지저장", "스마트그리드", "석유가스"],
    en: ["Solar Power", "Wind Power", "Hydrogen Energy", "Energy Storage", "Smart Grid", "Oil & Gas"],
    ar: ["الطاقة الشمسية", "طاقة الرياح", "طاقة الهيدروجين", "تخزين الطاقة", "الشبكة الذكية", "النفط والغاز"]
  },
  finance: {
    ko: ["디지털뱅킹", "핀테크", "블록체인", "결제서비스", "투자서비스", "이슬람금융"],
    en: ["Digital Banking", "Fintech", "Blockchain", "Payment Services", "Investment Services", "Islamic Finance"],
    ar: ["الخدمات المصرفية الرقمية", "التكنولوجيا المالية", "البلوك تشين", "خدمات الدفع", "خدمات الاستثمار", "التمويل الإسلامي"]
  },
  petrochemical: {
    ko: ["플라스틱", "화학원료", "특수화학", "정유", "석유화학", "친환경소재"],
    en: ["Plastics", "Chemical Materials", "Specialty Chemicals", "Refining", "Petrochemicals", "Eco-friendly Materials"],
    ar: ["البلاستيك", "المواد الكيميائية", "الكيماويات المتخصصة", "التكرير", "البتروكيماويات", "المواد الصديقة للبيئة"]
  },
  aviation: {
    ko: ["항공운송", "화물운송", "항공유지보수", "공항운영", "항공보안", "승무원교육"],
    en: ["Air Transport", "Cargo Transport", "Aircraft Maintenance", "Airport Operations", "Aviation Security", "Crew Training"],
    ar: ["النقل الجوي", "نقل البضائع", "صيانة الطائرات", "عمليات المطار", "أمن الطيران", "تدريب الطاقم"]
  },
  other: {
    ko: ["이커머스", "물류", "식품", "의료", "교육", "관광", "엔터테인먼트"],
    en: ["E-commerce", "Logistics", "Food", "Healthcare", "Education", "Tourism", "Entertainment"],
    ar: ["التجارة الإلكترونية", "اللوجستيات", "الأغذية", "الرعاية الصحية", "التعليم", "السياحة", "الترفيه"]
  }
};

// 기업 규모별 직원 수 범위
const companySizeRanges = {
  small: { min: 10, max: 99 },
  medium: { min: 100, max: 999 },
  large: { min: 1000, max: 50000 }
};

// 랜덤 유틸리티 함수들
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateWebsite(nameEn) {
  const domains = ['.com', '.co.kr', '.com.sa', '.ae', '.qa', '.kw'];
  return 'https://www.' + nameEn.toLowerCase().replace(/\s+/g, '') + randomChoice(domains);
}

function generateEmail(nameEn) {
  const domains = ['gmail.com', 'company.com', 'business.co.kr', 'corp.sa'];
  return 'contact@' + nameEn.toLowerCase().replace(/\s+/g, '') + '.' + randomChoice(domains);
}

// 한국 기업 생성 함수
function generateKoreanCompanies(count) {
  const companies = [];
  const industries = Object.keys(industryProducts);
  const sizes = ['small', 'medium', 'large'];
  const cities = [
    { ko: "서울", en: "Seoul", ar: "سيول" },
    { ko: "부산", en: "Busan", ar: "بوسان" },
    { ko: "대구", en: "Daegu", ar: "دايغو" },
    { ko: "인천", en: "Incheon", ar: "إنتشون" },
    { ko: "광주", en: "Gwangju", ar: "غوانغجو" },
    { ko: "대전", en: "Daejeon", ar: "دايجون" },
    { ko: "울산", en: "Ulsan", ar: "أولسان" },
    { ko: "수원", en: "Suwon", ar: "سوون" },
    { ko: "창원", en: "Changwon", ar: "تشانغوون" },
    { ko: "성남", en: "Seongnam", ar: "سونغنام" }
  ];

  // 기존 기본 기업들 먼저 추가
  koreanCompanyBases.forEach(base => {
    const industry = base.industry;
    const size = base.size;
    const products = industryProducts[industry];
    
    const company = {
      id: companies.length + 1,
      name: base.name,
      name_en: base.nameEn,
      name_ar: base.nameAr,
      country: "KR",
      country_name_ko: "대한민국",
      country_name_en: "South Korea", 
      country_name_ar: "كوريا الجنوبية",
      industry: industry,
      industry_name_ko: getIndustryName(industry, 'ko'),
      industry_name_en: getIndustryName(industry, 'en'),
      industry_name_ar: getIndustryName(industry, 'ar'),
      size: size,
      location: base.city,
      location_en: base.cityEn,
      location_ar: base.cityAr,
      employees: randomInt(companySizeRanges[size].min, companySizeRanges[size].max),
      founded: randomInt(1950, 2020),
      website: generateWebsite(base.nameEn),
      contact_email: generateEmail(base.nameEn),
      description: generateDescription(base.name, industry, 'ko'),
      description_en: generateDescription(base.nameEn, industry, 'en'),
      description_ar: generateDescription(base.nameAr || base.nameEn, industry, 'ar'),
      products: randomChoices(products.ko, randomInt(3, 6)).join(', '),
      products_en: randomChoices(products.en, randomInt(3, 6)).join(', '),
      products_ar: randomChoices(products.ar, randomInt(3, 6)).join(', '),
      cooperation_types: randomChoices(['수출', '수입', '합작투자', '기술이전', '라이센싱', '유통협력'], randomInt(2, 4)).join(', '),
      cooperation_types_en: randomChoices(['Export', 'Import', 'Joint Venture', 'Technology Transfer', 'Licensing', 'Distribution'], randomInt(2, 4)).join(', '),
      cooperation_types_ar: randomChoices(['التصدير', 'الاستيراد', 'المشروع المشترك', 'نقل التكنولوجيا', 'الترخيص', 'التوزيع'], randomInt(2, 4)).join(', '),
      target_countries: randomChoices(['SA', 'AE', 'QA', 'KW', 'BH', 'OM'], randomInt(2, 4)).join(', ')
    };
    
    companies.push(company);
  });

  // 추가 한국 기업들 생성
  const companyPrefixes = ['한국', '대한', '코리아', '서울', '부산', '글로벌', '퓨처', '스마트', '이노베이션', '테크'];
  const companyTypes = ['시스템', '테크놀로지', '솔루션', '엔지니어링', '인더스트리', '코퍼레이션', '그룹', '컴퍼니'];

  for (let i = koreanCompanyBases.length; i < count; i++) {
    const industry = randomChoice(industries);
    const size = randomChoice(sizes);
    const city = randomChoice(cities);
    const products = industryProducts[industry];
    
    const companyName = randomChoice(companyPrefixes) + randomChoice(companyTypes);
    const companyNameEn = generateEnglishName();
    const companyNameAr = generateArabicName();
    
    const company = {
      id: companies.length + 1,
      name: companyName,
      name_en: companyNameEn,
      name_ar: companyNameAr,
      country: "KR",
      country_name_ko: "대한민국",
      country_name_en: "South Korea",
      country_name_ar: "كوريا الجنوبية",
      industry: industry,
      industry_name_ko: getIndustryName(industry, 'ko'),
      industry_name_en: getIndustryName(industry, 'en'), 
      industry_name_ar: getIndustryName(industry, 'ar'),
      size: size,
      location: city.ko,
      location_en: city.en,
      location_ar: city.ar,
      employees: randomInt(companySizeRanges[size].min, companySizeRanges[size].max),
      founded: randomInt(1960, 2023),
      website: generateWebsite(companyNameEn),
      contact_email: generateEmail(companyNameEn),
      description: generateDescription(companyName, industry, 'ko'),
      description_en: generateDescription(companyNameEn, industry, 'en'),
      description_ar: generateDescription(companyNameAr, industry, 'ar'),
      products: randomChoices(products.ko, randomInt(3, 6)).join(', '),
      products_en: randomChoices(products.en, randomInt(3, 6)).join(', '),
      products_ar: randomChoices(products.ar, randomInt(3, 6)).join(', '),
      cooperation_types: randomChoices(['수출', '수입', '합작투자', '기술이전', '라이센싱', '유통협력'], randomInt(2, 4)).join(', '),
      cooperation_types_en: randomChoices(['Export', 'Import', 'Joint Venture', 'Technology Transfer', 'Licensing', 'Distribution'], randomInt(2, 4)).join(', '),
      cooperation_types_ar: randomChoices(['التصدير', 'الاستيراد', 'المشروع المشترك', 'نقل التكنولوجيا', 'الترخيص', 'التوزيع'], randomInt(2, 4)).join(', '),
      target_countries: randomChoices(['SA', 'AE', 'QA', 'KW', 'BH', 'OM'], randomInt(2, 4)).join(', ')
    };
    
    companies.push(company);
  }

  return companies;
}

// 아랍 기업 생성 함수
function generateArabCompanies(count) {
  const companies = [];
  const industries = Object.keys(industryProducts);
  const sizes = ['small', 'medium', 'large'];
  
  const countries = [
    { code: 'SA', ko: '사우디아라비아', en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    { code: 'AE', ko: '아랍에미리트', en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    { code: 'QA', ko: '카타르', en: 'Qatar', ar: 'قطر' },
    { code: 'KW', ko: '쿠웨이트', en: 'Kuwait', ar: 'الكويت' },
    { code: 'BH', ko: '바레인', en: 'Bahrain', ar: 'البحرين' },
    { code: 'OM', ko: '오만', en: 'Oman', ar: 'عُمان' }
  ];

  const cities = {
    SA: [{ ko: "리야드", en: "Riyadh", ar: "الرياض" }, { ko: "젯다", en: "Jeddah", ar: "جدة" }, { ko: "다란", en: "Dhahran", ar: "الظهران" }],
    AE: [{ ko: "두바이", en: "Dubai", ar: "دبي" }, { ko: "아부다비", en: "Abu Dhabi", ar: "أبوظبي" }, { ko: "샤르자", en: "Sharjah", ar: "الشارقة" }],
    QA: [{ ko: "도하", en: "Doha", ar: "الدوحة" }, { ko: "알와크라", en: "Al Wakrah", ar: "الوكرة" }],
    KW: [{ ko: "쿠웨이트시티", en: "Kuwait City", ar: "مدينة الكويت" }, { ko: "알아흐마디", en: "Al Ahmadi", ar: "الأحمدي" }],
    BH: [{ ko: "마나마", en: "Manama", ar: "المنامة" }, { ko: "무하라크", en: "Muharraq", ar: "المحرق" }],
    OM: [{ ko: "무스카트", en: "Muscat", ar: "مسقط" }, { ko: "살랄라", en: "Salalah", ar: "صلالة" }]
  };

  // 기존 기본 기업들 먼저 추가
  arabCompanyBases.forEach(base => {
    const industry = base.industry;
    const size = base.size;
    const products = industryProducts[industry];
    const country = countries.find(c => c.code === base.country);
    
    const company = {
      id: companies.length + 1,
      name: base.nameKo || base.name,
      name_en: base.name,
      name_ar: base.nameAr,
      country: base.country,
      country_name_ko: country.ko,
      country_name_en: country.en,
      country_name_ar: country.ar,
      industry: industry,
      industry_name_ko: getIndustryName(industry, 'ko'),
      industry_name_en: getIndustryName(industry, 'en'),
      industry_name_ar: getIndustryName(industry, 'ar'),
      size: size,
      location: base.cityKo || base.city,
      location_en: base.city,
      location_ar: base.cityAr,
      employees: randomInt(companySizeRanges[size].min, companySizeRanges[size].max),
      founded: randomInt(1950, 2020),
      website: generateWebsite(base.name),
      contact_email: generateEmail(base.name),
      description: generateDescription(base.nameKo || base.name, industry, 'ko'),
      description_en: generateDescription(base.name, industry, 'en'),
      description_ar: generateDescription(base.nameAr, industry, 'ar'),
      products: randomChoices(products.ko, randomInt(3, 6)).join(', '),
      products_en: randomChoices(products.en, randomInt(3, 6)).join(', '),
      products_ar: randomChoices(products.ar, randomInt(3, 6)).join(', '),
      cooperation_types: randomChoices(['수출', '수입', '합작투자', '기술이전', '라이센싱', '유통협력'], randomInt(2, 4)).join(', '),
      cooperation_types_en: randomChoices(['Export', 'Import', 'Joint Venture', 'Technology Transfer', 'Licensing', 'Distribution'], randomInt(2, 4)).join(', '),
      cooperation_types_ar: randomChoices(['التصدير', 'الاستيراد', 'المشروع المشترك', 'نقل التكنولوجيا', 'الترخيص', 'التوزيع'], randomInt(2, 4)).join(', '),
      target_countries: 'KR'
    };
    
    companies.push(company);
  });

  // 추가 아랍 기업들 생성
  const arabCompanyPrefixes = ['Al', 'Gulf', 'Arab', 'Emirates', 'Saudi', 'Qatar', 'Kuwait', 'International'];
  const arabCompanySuffixes = ['Group', 'Holdings', 'Company', 'Corporation', 'Industries', 'Investment', 'Trading', 'Systems'];

  for (let i = arabCompanyBases.length; i < count; i++) {
    const industry = randomChoice(industries);
    const size = randomChoice(sizes);
    const country = randomChoice(countries);
    const city = randomChoice(cities[country.code]);
    const products = industryProducts[industry];
    
    const companyNameEn = randomChoice(arabCompanyPrefixes) + ' ' + randomChoice(arabCompanySuffixes);
    const companyNameKo = generateKoreanName(companyNameEn);
    const companyNameAr = generateArabicCompanyName();
    
    const company = {
      id: companies.length + 1,
      name: companyNameKo,
      name_en: companyNameEn,
      name_ar: companyNameAr,
      country: country.code,
      country_name_ko: country.ko,
      country_name_en: country.en,
      country_name_ar: country.ar,
      industry: industry,
      industry_name_ko: getIndustryName(industry, 'ko'),
      industry_name_en: getIndustryName(industry, 'en'),
      industry_name_ar: getIndustryName(industry, 'ar'),
      size: size,
      location: city.ko,
      location_en: city.en,
      location_ar: city.ar,
      employees: randomInt(companySizeRanges[size].min, companySizeRanges[size].max),
      founded: randomInt(1960, 2023),
      website: generateWebsite(companyNameEn),
      contact_email: generateEmail(companyNameEn),
      description: generateDescription(companyNameKo, industry, 'ko'),
      description_en: generateDescription(companyNameEn, industry, 'en'),
      description_ar: generateDescription(companyNameAr, industry, 'ar'),
      products: randomChoices(products.ko, randomInt(3, 6)).join(', '),
      products_en: randomChoices(products.en, randomInt(3, 6)).join(', '),
      products_ar: randomChoices(products.ar, randomInt(3, 6)).join(', '),
      cooperation_types: randomChoices(['수출', '수입', '합작투자', '기술이전', '라이센싱', '유통협력'], randomInt(2, 4)).join(', '),
      cooperation_types_en: randomChoices(['Export', 'Import', 'Joint Venture', 'Technology Transfer', 'Licensing', 'Distribution'], randomInt(2, 4)).join(', '),
      cooperation_types_ar: randomChoices(['التصدير', 'الاستيراد', 'المشروع المشترك', 'نقل التكنولوجيا', 'الترخيص', 'التوزيع'], randomInt(2, 4)).join(', '),
      target_countries: 'KR'
    };
    
    companies.push(company);
  }

  return companies;
}

// 헬퍼 함수들
function getIndustryName(industry, lang) {
  const names = {
    ict: { ko: 'IT/ICT', en: 'IT/ICT', ar: 'تكنولوجيا المعلومات والاتصالات' },
    automotive: { ko: '자동차', en: 'Automotive', ar: 'السيارات' },
    construction: { ko: '건설/인프라', en: 'Construction/Infrastructure', ar: 'البناء والبنية التحتية' },
    energy: { ko: '에너지', en: 'Energy', ar: 'الطاقة' },
    finance: { ko: '금융', en: 'Finance', ar: 'التمويل' },
    petrochemical: { ko: '석유화학', en: 'Petrochemicals', ar: 'البتروكيماويات' },
    aviation: { ko: '항공', en: 'Aviation', ar: 'الطيران' },
    other: { ko: '기타', en: 'Other', ar: 'أخرى' }
  };
  return names[industry] ? names[industry][lang] : industry;
}

function generateDescription(name, industry, lang) {
  const templates = {
    ko: `${name}는 ${getIndustryName(industry, 'ko')} 분야의 선도 기업으로, 혁신적인 기술과 우수한 품질의 제품 및 서비스를 제공합니다.`,
    en: `${name} is a leading company in the ${getIndustryName(industry, 'en')} sector, providing innovative technology and high-quality products and services.`,
    ar: `${name} هي شركة رائدة في قطاع ${getIndustryName(industry, 'ar')}، وتقدم التكنولوجيا المبتكرة والمنتجات والخدمات عالية الجودة.`
  };
  return templates[lang];
}

function generateEnglishName() {
  const prefixes = ['Advanced', 'Global', 'Smart', 'Future', 'Innovation', 'Digital', 'Next', 'Prime'];
  const cores = ['Tech', 'Systems', 'Solutions', 'Industries', 'Dynamics', 'Works', 'Labs', 'Corp'];
  return randomChoice(prefixes) + ' ' + randomChoice(cores);
}

function generateKoreanName(englishName) {
  const translations = {
    'Advanced': '어드밴스드', 'Global': '글로벌', 'Smart': '스마트', 'Future': '퓨처',
    'Innovation': '이노베이션', 'Digital': '디지털', 'Next': '넥스트', 'Prime': '프라임',
    'Tech': '테크', 'Systems': '시스템즈', 'Solutions': '솔루션즈', 'Industries': '인더스트리',
    'Dynamics': '다이나믹스', 'Works': '웍스', 'Labs': '랩', 'Corp': '코퍼레이션',
    'Al': '알', 'Gulf': '걸프', 'Arab': '아랍', 'Emirates': '에미레이츠',
    'Saudi': '사우디', 'Qatar': '카타르', 'Kuwait': '쿠웨이트', 'International': '인터내셔널',
    'Group': '그룹', 'Holdings': '홀딩스', 'Company': '컴퍼니', 'Corporation': '코퍼레이션',
    'Investment': '인베스트먼트', 'Trading': '트레이딩'
  };
  
  return englishName.split(' ').map(word => translations[word] || word).join(' ');
}

function generateArabicName() {
  const arabPrefixes = ['الشركة', 'مؤسسة', 'مجموعة', 'شركة'];
  const arabCores = ['التكنولوجيا', 'الأنظمة', 'الحلول', 'الصناعات', 'التطوير'];
  return randomChoice(arabPrefixes) + ' ' + randomChoice(arabCores);
}

function generateArabicCompanyName() {
  const arabNames = [
    'شركة الخليج للتكنولوجيا', 'مجموعة الإمارات للاستثمار', 'شركة المستقبل للأنظمة',
    'مؤسسة العربية للصناعات', 'شركة الابتكار والتطوير', 'مجموعة الشرق الأوسط',
    'شركة النهضة للحلول', 'مؤسسة التقدم التقني', 'شركة الرؤية الذكية'
  ];
  return randomChoice(arabNames);
}

// 메인 실행 함수
function generateMegaDataset() {
  console.log('🚀 Generating mega dataset with 500+ companies...');
  
  // 300개 한국 기업 + 250개 아랍 기업 = 550개 총 기업
  const koreanCompanies = generateKoreanCompanies(300);
  const arabCompanies = generateArabCompanies(250);
  
  const allCompanies = [...koreanCompanies, ...arabCompanies];
  
  console.log(`✅ Generated ${allCompanies.length} companies:`);
  console.log(`   - Korean companies: ${koreanCompanies.length}`);
  console.log(`   - Arab companies: ${arabCompanies.length}`);
  
  // SQL 파일 생성
  const sqlStatements = [];
  
  // Companies 테이블 데이터
  allCompanies.forEach(company => {
    const sql = `INSERT OR REPLACE INTO companies (
      name, name_en, name_ar, country, industry, size, location, location_en, location_ar,
      employees, founded, website, contact_email, 
      description, description_en, description_ar,
      products, products_en, products_ar,
      cooperation_types, cooperation_types_en, cooperation_types_ar,
      target_countries
    ) VALUES (
      '${company.name.replace(/'/g, "''")}',
      '${company.name_en.replace(/'/g, "''")}',
      '${company.name_ar.replace(/'/g, "''")}',
      '${company.country}',
      '${company.industry}',
      '${company.size}',
      '${company.location.replace(/'/g, "''")}',
      '${company.location_en.replace(/'/g, "''")}',
      '${company.location_ar.replace(/'/g, "''")}',
      ${company.employees},
      ${company.founded},
      '${company.website}',
      '${company.contact_email}',
      '${company.description.replace(/'/g, "''")}',
      '${company.description_en.replace(/'/g, "''")}',
      '${company.description_ar.replace(/'/g, "''")}',
      '${company.products.replace(/'/g, "''")}',
      '${company.products_en.replace(/'/g, "''")}',
      '${company.products_ar.replace(/'/g, "''")}',
      '${company.cooperation_types.replace(/'/g, "''")}',
      '${company.cooperation_types_en.replace(/'/g, "''")}',
      '${company.cooperation_types_ar.replace(/'/g, "''")}',
      '${company.target_countries}'
    );`;
    
    sqlStatements.push(sql);
  });
  
  // 협력 요청 생성 (100개)
  console.log('📋 Generating cooperation requests...');
  for (let i = 0; i < 100; i++) {
    const fromCompany = randomChoice(allCompanies);
    let toCompany = randomChoice(allCompanies);
    
    // 같은 회사끼리 요청 방지
    while (toCompany.id === fromCompany.id) {
      toCompany = randomChoice(allCompanies);
    }
    
    const statuses = ['pending', 'accepted', 'rejected'];
    const status = randomChoice(statuses);
    
    const messages = [
      '귀하의 제품에 관심이 있어 협력을 제안드립니다.',
      'We are interested in exploring business cooperation opportunities.',
      '기술 파트너십을 통한 상호 발전을 기대합니다.',
      'Looking forward to potential joint venture opportunities.',
      '우리 시장에서의 유통 협력을 논의하고 싶습니다.'
    ];
    
    const sql = `INSERT INTO cooperation_requests (
      from_company_id, to_company_id, cooperation_type, title, message, status, created_at
    ) VALUES (
      ${fromCompany.id}, ${toCompany.id}, 
      '${randomChoice(['수출', '수입', '합작투자', '기술이전'])}',
      '비즈니스 협력 제안',
      '${randomChoice(messages).replace(/'/g, "''")}',
      '${status}',
      datetime('now', '-${randomInt(1, 90)} days')
    );`;
    
    sqlStatements.push(sql);
  }
  
  // SQL 파일 저장
  const sqlContent = sqlStatements.join('\n\n');
  fs.writeFileSync('mega_dataset.sql', sqlContent);
  
  // JSON 파일도 저장
  fs.writeFileSync('mega_companies.json', JSON.stringify(allCompanies, null, 2));
  
  console.log(`✅ Generated files:`);
  console.log(`   - mega_dataset.sql (${sqlStatements.length} statements)`);
  console.log(`   - mega_companies.json (${allCompanies.length} companies)`);
  console.log('🎉 Mega dataset generation complete!');
}

// 실행
generateMegaDataset();