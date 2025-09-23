// Generate Large Dataset - 1000+ SMEs with Enhanced Matching Data
const { industrySpecificData } = require('./update_company_data.cjs');

// 한국 기업명 생성용 데이터
const koreanCompanyNames = [
  // 기술 관련
  "테크노", "이노베이션", "디지털", "스마트", "퓨처", "넥스트", "어드밴스드", "프로그레시브",
  "인텔리전트", "솔루션", "시스템즈", "엔터프라이즈", "글로벌", "코리아", "월드와이드", 
  // 전통 기업
  "정밀", "첨단", "하이텍", "산업", "제조", "엔지니어링", "머티리얼즈", "케미컬",
  "일렉트로닉스", "메카트로닉스", "인더스트리", "매뉴팩처링", "테크놀로지"
];

const koreanSuffixes = ["", "테크", "코퍼레이션", "인더스트리", "그룹", "컴퍼니", "엔터프라이즈", "시스템", "솔루션"];

// 아랍 기업명 생성용 데이터  
const arabCompanyPrefixes = [
  "Al", "Gulf", "Emirates", "Saudi", "Qatar", "Kuwait", "Bahrain", "Oman", "Middle East", 
  "Arab", "International", "United", "Advanced", "Modern", "Future", "Smart", "Digital",
  "Global", "Regional", "National", "Premier", "Elite", "Supreme", "Royal", "Crown"
];

const arabCompanySuffixes = [
  "Holdings", "Group", "Corporation", "Company", "Industries", "Systems", "Solutions", 
  "Technologies", "Services", "Enterprises", "International", "Trading", "Investment",
  "Development", "Engineering", "Manufacturing", "Consulting", "Partners", "Ventures"
];

// 도시 데이터
const koreanCities = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

const arabCities = {
  AE: ["두바이", "아부다비", "샤르자", "아즈만"],
  SA: ["리야드", "제다", "담맘", "다란", "메디나", "타이프"],
  QA: ["도하", "알와크라", "알라얀", "알코르"],
  KW: ["쿠웨이트시티", "알아마디", "하왈리", "파르와니야"],
  BH: ["마나마", "무하라크", "리파", "이사타운"],
  OM: ["무스카트", "살랄라", "니즈와", "수하르"],
  JO: ["암만", "이르비드", "자르카", "아카바"],
  EG: ["카이로", "알렉산드리아", "기자", "수에즈"]
};

// 산업 분야
const industries = ["ict", "energy", "automotive", "petrochemical", "finance", "aviation", "construction", "healthcare", "agriculture", "manufacturing", "logistics"];

// 협력 유형
const cooperationTypes = ["수출", "수입", "합작투자", "기술이전", "유통협력", "라이센싱", "프로젝트협력"];

// 기업 규모 및 직원 수 매핑
const companySizes = {
  startup: { min: 5, max: 50 },
  small: { min: 51, max: 300 },
  medium: { min: 301, max: 1000 },
  large: { min: 1001, max: 10000 }
};

// 매출 구간
const revenueRanges = ["small", "medium", "large", "xlarge"];
const investmentCapacities = ["small", "medium", "large", "xlarge"];
const companyStages = ["startup", "growth", "mature", "established"];

// 기업명 생성 함수
function generateKoreanCompanyName() {
  const prefix = koreanCompanyNames[Math.floor(Math.random() * koreanCompanyNames.length)];
  const suffix = koreanSuffixes[Math.floor(Math.random() * koreanSuffixes.length)];
  return prefix + suffix;
}

function generateArabCompanyName() {
  const prefix = arabCompanyPrefixes[Math.floor(Math.random() * arabCompanyPrefixes.length)];
  const suffix = arabCompanySuffixes[Math.floor(Math.random() * arabCompanySuffixes.length)];
  return `${prefix} ${suffix}`;
}

// 랜덤 선택 함수
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 협력 니즈 생성 함수
function generateCooperationNeeds(industry, country, companyType) {
  const industryData = industrySpecificData[industry] || industrySpecificData.ict;
  const examples = industryData.cooperation_examples;
  
  if (country === "KR") {
    // 한국 기업 - 수출 지향적 니즈
    const regions = randomChoices(["AE", "SA", "QA", "KW", "BH", "OM"], Math.floor(Math.random() * 3) + 1);
    const regionNames = regions.map(r => {
      const names = { AE: "UAE", SA: "사우디", QA: "카타르", KW: "쿠웨이트", BH: "바레인", OM: "오만" };
      return names[r];
    }).join(", ");
    
    const purposes = [
      `${regionNames} 시장 진출을 위한 현지 파트너십`,
      `중동 지역 ${industryData.keywords.slice(0,3).join(", ")} 프로젝트 참여`,
      `${regionNames}에서 ${randomChoice(industryData.keywords)} 기술 협력`,
      `걸프 지역 ${randomChoice(["정부", "민간", "대기업"])} 프로젝트 공급업체 자격 확보`
    ];
    
    return randomChoice(purposes) + "을 통해 해외 매출 확대와 기술력 검증을 목표로 합니다";
  } else {
    // 아랍 기업 - 기술 도입 및 현지화 니즈  
    const techs = randomChoices(industryData.keywords, Math.floor(Math.random() * 3) + 2);
    const purposes = [
      `한국의 첨단 ${techs.join(", ")} 기술 도입을 통한 경쟁력 강화`,
      `현지 ${randomChoice(["정부 정책", "비전 2030", "경제 다각화", "디지털 전환"])} 실현을 위한 한국 기업과의 기술 협력`,
      `${techs.join(", ")} 분야에서 한국 파트너와의 합작투자를 통한 사업 확장`,
      `한국의 우수한 ${randomChoice(techs)} 기술을 활용한 현지 시장 혁신`
    ];
    
    return randomChoice(purposes) + "를 추진하여 지역 시장 리더십을 확보하고자 합니다";
  }
}

// 회사 정보 생성 함수
function generateCompany(country, index) {
  const isKorean = country === "KR";
  const industry = randomChoice(industries);
  const size = randomChoice(Object.keys(companySizes));
  const employeeRange = companySizes[size];
  const employees = Math.floor(Math.random() * (employeeRange.max - employeeRange.min + 1)) + employeeRange.min;
  
  // 기본 정보
  const company = {
    name: isKorean ? generateKoreanCompanyName() : generateArabCompanyName(),
    name_en: null, // Will be set based on Korean/English
    name_ar: null,
    country: country,
    location: isKorean ? randomChoice(koreanCities) : randomChoice(arabCities[country] || ["수도"]),
    location_en: null, // Will be set
    location_ar: null,
    industry: industry,
    size: size,
    employees: employees,
    founded: Math.floor(Math.random() * (2024 - 1970 + 1)) + 1970,
    website: `https://www.${isKorean ? generateKoreanCompanyName() : generateArabCompanyName()}.${isKorean ? "co.kr" : randomChoice(["ae", "sa", "qa", "com"])}`,
    contact_email: `contact@company${index}.${isKorean ? "co.kr" : "com"}`,
    
    // 확장된 정보
    cooperation_needs: generateCooperationNeeds(industry, country, isKorean ? "korean" : "arab"),
    cooperation_keywords: JSON.stringify(randomChoices(industrySpecificData[industry]?.keywords || [], Math.floor(Math.random() * 4) + 3)),
    business_model: randomChoice(["B2B", "B2C", "B2G", "B2B2C"]),
    target_markets: JSON.stringify(isKorean ? randomChoices(["AE", "SA", "QA", "KW", "BH", "OM"], Math.floor(Math.random() * 3) + 1) : 
                                             randomChoices(["KR", "AE", "SA", "QA"], Math.floor(Math.random() * 2) + 1)),
    investment_capacity: randomChoice(investmentCapacities),
    technology_focus: JSON.stringify(randomChoices(industrySpecificData[industry]?.keywords || [], Math.floor(Math.random() * 3) + 2)),
    competitive_advantages: `${randomChoice([
      "특허 기술 보유", "시장 선도 기업", "정부 인증", "글로벌 네트워크", "우수한 품질",
      "경험 풍부한 전문가", "첨단 시설", "혁신적 기술", "강력한 R&D", "전략적 파트너십"
    ])}, ${randomChoice([
      "업계 최고 수준의 기술력", "다수의 성공 사례", "안정적인 공급망", "우수한 고객 서비스",
      "지속적인 혁신", "글로벌 표준 준수", "친환경 솔루션", "맞춤형 서비스"
    ])}`,
    
    contact_person: isKorean ? randomChoice(["김영수", "박민정", "이철호", "정수연", "최대영", "한미경"]) :
                             randomChoice(["Ahmed Al-Mansouri", "Fatima Al-Zahra", "Omar Bin Rashid", "Aisha Al-Qasimi", "Khalid Al-Thani"]),
    contact_position: randomChoice(["CEO", "사업개발팀장", "해외마케팅이사", "기술이사", "영업본부장", "전략기획실장"]),
    contact_language: JSON.stringify(isKorean ? ["ko", "en"] : ["ar", "en"]),
    preferred_cooperation: JSON.stringify(randomChoices(cooperationTypes, Math.floor(Math.random() * 3) + 2)),
    company_stage: randomChoice(companyStages),
    annual_revenue: randomChoice(revenueRanges),
    export_ratio: isKorean ? Math.floor(Math.random() * 80) + 10 : Math.floor(Math.random() * 30),
    rd_investment_ratio: Math.floor(Math.random() * 25) + 5,
    
    status: "active"
  };
  
  // 영어/아랍어 이름 설정
  if (isKorean) {
    company.name_en = company.name + " Co., Ltd.";
    company.name_ar = "شركة " + company.name;
    company.location_en = company.location + ", South Korea";
    company.location_ar = company.location + "، كوريا الجنوبية";
  } else {
    company.name_en = company.name;
    company.name_ar = "شركة " + company.name.split(" ")[0];
    company.location_en = company.location;
    company.location_ar = company.location;
  }
  
  // 설명 생성
  const industryName = {
    ko: { ict: "IT/ICT", energy: "에너지", automotive: "자동차", petrochemical: "석유화학", 
          finance: "금융", healthcare: "헬스케어", agriculture: "농업기술", manufacturing: "제조업" },
    en: { ict: "IT/ICT", energy: "Energy", automotive: "Automotive", petrochemical: "Petrochemicals",
          finance: "Finance", healthcare: "Healthcare", agriculture: "AgTech", manufacturing: "Manufacturing" },
    ar: { ict: "تكنولوجيا المعلومات", energy: "الطاقة", automotive: "السيارات", petrochemical: "البتروكيماويات",
          finance: "المالية", healthcare: "الرعاية الصحية", agriculture: "التكنولوجيا الزراعية", manufacturing: "التصنيع" }
  }[industry] || industry;
  
  company.description = `${company.name}는 ${industryName.ko || industry} 분야의 ${randomChoice(["선도", "혁신", "전문"])} 기업으로, ${randomChoice(["첨단 기술", "우수한 품질", "혁신적인 솔루션"])}과 ${randomChoice(["전문 서비스", "맞춤형 제품", "글로벌 네트워크"])}을 제공합니다.`;
  
  company.description_en = `${company.name_en} is a ${randomChoice(["leading", "innovative", "specialized"])} company in the ${industryName.en || industry} sector, providing ${randomChoice(["advanced technology", "high-quality products", "innovative solutions"])} and ${randomChoice(["professional services", "customized products", "global network"])}.`;
  
  company.description_ar = `${company.name_ar} شركة ${randomChoice(["رائدة", "مبتكرة", "متخصصة"])} في قطاع ${industryName.ar || industry}، وتقدم ${randomChoice(["التكنولوجيا المتقدمة", "المنتجات عالية الجودة", "الحلول المبتكرة"])} و${randomChoice(["الخدمات المهنية", "المنتجات المخصصة", "الشبكة العالمية"])}.`;
  
  // 제품/서비스 설정
  const productKeywords = industrySpecificData[industry]?.keywords || ["제품", "서비스", "솔루션"];
  company.products = randomChoices(productKeywords, Math.floor(Math.random() * 4) + 2).join(", ");
  company.products_en = company.products; // 영어 키워드 사용
  company.products_ar = company.products; // 아랍어 번역 필요시 추가
  
  company.cooperation_types = randomChoices(cooperationTypes, Math.floor(Math.random() * 3) + 2).join(", ");
  company.cooperation_types_en = company.cooperation_types.replace(/수출/g, "Export").replace(/수입/g, "Import")
    .replace(/합작투자/g, "Joint Venture").replace(/기술이전/g, "Technology Transfer")
    .replace(/유통협력/g, "Distribution").replace(/라이센싱/g, "Licensing");
  company.cooperation_types_ar = company.cooperation_types_en; // 아랍어 번역
  
  company.target_countries = isKorean ? randomChoices(["AE", "SA", "QA", "KW"], Math.floor(Math.random() * 2) + 1).join(",") : "KR";
  
  return company;
}

// 대량 데이터 생성
function generateLargeDataset() {
  const companies = [];
  
  // 한국 기업 600개
  for (let i = 1; i <= 600; i++) {
    companies.push(generateCompany("KR", i));
  }
  
  // 아랍 기업 500개 (각국 분산)
  const arabCountries = ["AE", "SA", "QA", "KW", "BH", "OM", "JO", "EG"];
  for (let i = 601; i <= 1100; i++) {
    const country = arabCountries[(i - 601) % arabCountries.length];
    companies.push(generateCompany(country, i));
  }
  
  console.log(`Generated ${companies.length} companies:`);
  console.log(`- Korean companies: ${companies.filter(c => c.country === "KR").length}`);
  console.log(`- Arab companies: ${companies.filter(c => c.country !== "KR").length}`);
  
  return companies;
}

module.exports = { generateLargeDataset };