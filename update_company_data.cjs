// Enhanced Company Data Update Script - Add Realistic Business Needs and Matching Info
const companyEnhancements = {
  // Korean Companies - Technology Leaders
  korean_companies: [
    {
      cooperation_needs: "UAE와 사우디 시장 진출을 위한 현지 유통 파트너를 찾고 있으며, 특히 스마트시티 솔루션 분야에서 기술 협력을 희망합니다",
      cooperation_keywords: '["스마트시티", "IoT", "빅데이터", "AI솔루션", "디지털트윈"]',
      business_model: "B2B",
      target_markets: '["AE", "SA", "QA"]',
      investment_capacity: "large",
      technology_focus: '["AI", "IoT", "빅데이터", "클라우드"]',
      competitive_advantages: "20년 이상의 ICT 기술 축적, 국내 스마트시티 프로젝트 다수 성공사례 보유, 정부 인증 기술력",
      contact_person: "김영호",
      contact_position: "해외사업부장",
      contact_language: '["ko", "en"]',
      preferred_cooperation: '["수출", "합작투자", "기술이전"]',
      company_stage: "established",
      annual_revenue: "large",
      export_ratio: 45,
      rd_investment_ratio: 15
    },
    {
      cooperation_needs: "중동 지역 재생에너지 프로젝트 참여를 위해 현지 EPC업체 및 투자자와의 파트너십을 원하며, 태양광 및 ESS 솔루션을 공급하고자 합니다",
      cooperation_keywords: '["태양광", "ESS", "재생에너지", "스마트그리드", "에너지저장"]',
      business_model: "B2B",
      target_markets: '["AE", "SA", "OM"]',
      investment_capacity: "medium",
      technology_focus: '["태양광", "배터리", "에너지관리", "스마트그리드"]',
      competitive_advantages: "세계 3위 태양광 모듈 기술력, 차세대 ESS 특허 기술 보유, 국내외 대규모 프로젝트 경험",
      contact_person: "박정수",
      contact_position: "중동사업담당",
      contact_language: '["ko", "en"]',
      preferred_cooperation: '["수출", "합작투자", "프로젝트협력"]',
      company_stage: "mature",
      annual_revenue: "large",
      export_ratio: 60,
      rd_investment_ratio: 12
    },
    {
      cooperation_needs: "사우디 NEOM 프로젝트 및 UAE 스마트 모빌리티 사업 참여를 위해 자율주행 기술과 전기차 충전 인프라 구축에서 현지 파트너와 협력하고자 합니다",
      cooperation_keywords: '["자율주행", "전기차", "충전인프라", "모빌리티", "커넥티드카"]',
      business_model: "B2B",
      target_markets: '["SA", "AE", "QA"]',
      investment_capacity: "large",
      technology_focus: '["자율주행", "전기차", "배터리", "충전기술"]',
      competitive_advantages: "글로벌 완성차 OEM 공급 경험, 차세대 자율주행 센서 기술, 초고속 충전 기술 보유",
      contact_person: "이민석",
      contact_position: "글로벌사업본부장",
      contact_language: '["ko", "en"]',
      preferred_cooperation: '["합작투자", "기술이전", "프로젝트협력"]',
      company_stage: "established",
      annual_revenue: "xlarge",
      export_ratio: 75,
      rd_investment_ratio: 18
    },
    {
      cooperation_needs: "중동 지역 디지털 헬스케어 시장 진출을 위해 AI 기반 의료진단 솔루션과 원격의료 플랫폼을 현지 병원 및 정부기관에 공급하고자 합니다",
      cooperation_keywords: '["AI의료진단", "원격의료", "디지털헬스케어", "의료영상", "헬스케어AI"]',
      business_model: "B2B",
      target_markets: '["AE", "SA", "KW"]',
      investment_capacity: "medium",
      technology_focus: '["AI", "의료영상", "원격의료", "빅데이터"]',
      competitive_advantages: "FDA 승인 AI 의료기기 보유, 아시아 최대 의료 AI 데이터셋, 정밀의료 알고리즘 특허",
      contact_person: "최영미",
      contact_position: "해외마케팅이사",
      contact_language: '["ko", "en"]',
      preferred_cooperation: '["수출", "라이센싱", "기술협력"]',
      company_stage: "growth",
      annual_revenue: "medium",
      export_ratio: 35,
      rd_investment_ratio: 25
    }
  ],

  // Arab Companies - Market Opportunities
  arab_companies: [
    {
      cooperation_needs: "사우디 NEOM 스마트시티 건설 프로젝트에서 한국의 첨단 건설기술과 스마트빌딩 솔루션을 도입하여 미래도시 인프라 구축에 협력하고자 합니다",
      cooperation_keywords: '["스마트빌딩", "건설기술", "스마트시티", "인프라", "NEOM프로젝트"]',
      business_model: "B2G",
      target_markets: '["SA", "AE", "QA"]',
      investment_capacity: "xlarge",
      technology_focus: '["스마트건설", "IoT", "빌딩자동화", "인프라"]',
      competitive_advantages: "사우디 정부 프로젝트 다수 수주 경험, 중동 최대 건설회사, 현지 네트워크 구축",
      contact_person: "Ahmed Al-Rashid",
      contact_position: "International Projects Director",
      contact_language: '["ar", "en"]',
      preferred_cooperation: '["기술이전", "합작투자", "프로젝트협력"]',
      company_stage: "established",
      annual_revenue: "xlarge",
      export_ratio: 25,
      rd_investment_ratio: 8
    },
    {
      cooperation_needs: "UAE 농업 다각화 정책에 따라 스마트팜 및 수직농장 구축을 위해 한국의 농업기술, 자동화 시스템, IoT 센서 기술과 협력을 원합니다",
      cooperation_keywords: '["스마트팜", "수직농장", "농업자동화", "IoT센서", "정밀농업"]',
      business_model: "B2B",
      target_markets: '["AE", "SA", "OM"]',
      investment_capacity: "large",
      technology_focus: '["농업기술", "IoT", "자동화", "센서기술"]',
      competitive_advantages: "UAE 정부 농업프로젝트 독점 파트너, 중동 최대 농업 유통망, 현지 기후 적응 기술",
      contact_person: "Fatima Al-Zahra",
      contact_position: "Business Development Manager",
      contact_language: '["ar", "en"]',
      preferred_cooperation: '["기술이전", "합작투자", "수입"]',
      company_stage: "growth",
      annual_revenue: "medium",
      export_ratio: 15,
      rd_investment_ratio: 12
    },
    {
      cooperation_needs: "카타르 2030 비전에 맞춰 핀테크 및 디지털 결제 생태계 구축을 위해 한국의 블록체인 기술, 디지털 월렛, AI 기반 금융 서비스와 파트너십을 추진하고자 합니다",
      cooperation_keywords: '["핀테크", "블록체인", "디지털결제", "AI금융", "디지털뱅킹"]',
      business_model: "B2C",
      target_markets: '["QA", "KW", "BH"]',
      investment_capacity: "large",
      technology_focus: '["블록체인", "AI", "핀테크", "디지털결제"]',
      competitive_advantages: "카타르 중앙은행 승인 금융기관, 걸프 지역 최대 디지털 결제 점유율, 이슬람 금융 전문성",
      contact_person: "Omar bin Khalifa",
      contact_position: "Chief Technology Officer",
      contact_language: '["ar", "en"]',
      preferred_cooperation: '["기술협력", "라이센싱", "합작투자"]',
      company_stage: "mature",
      annual_revenue: "large",
      export_ratio: 40,
      rd_investment_ratio: 20
    },
    {
      cooperation_needs: "바레인 Economic Vision 2030에 따른 석유화학 고도화 사업에서 한국의 정유·화학 기술과 친환경 화학공정 기술 도입을 통해 경쟁력을 강화하고자 합니다",
      cooperation_keywords: '["석유화학", "정유기술", "친환경화학", "화학공정", "고부가가치화학"]',
      business_model: "B2B",
      target_markets: '["BH", "SA", "KW"]',
      investment_capacity: "xlarge",
      technology_focus: '["석유화학", "정유", "화학공정", "친환경기술"]',
      competitive_advantages: "걸프 최대 석유화학 단지 운영, 정부 지원 화학 특구, 글로벌 원유 조달 네트워크",
      contact_person: "Khalid Al-Mansoori",
      contact_position: "Strategic Partnerships Director",
      contact_language: '["ar", "en"]',
      preferred_cooperation: '["기술이전", "합작투자", "프로젝트협력"]',
      company_stage: "established",
      annual_revenue: "xlarge",
      export_ratio: 60,
      rd_investment_ratio: 10
    },
    {
      cooperation_needs: "오만 물류 허브 구축 프로젝트에서 한국의 스마트 물류 기술, 자동화 창고 시스템, AI 기반 공급망 관리 솔루션 도입으로 중동 물류 중심지로 발전하고자 합니다",
      cooperation_keywords: '["스마트물류", "자동화창고", "AI공급망", "물류허브", "항만자동화"]',
      business_model: "B2B",
      target_markets: '["OM", "AE", "SA"]',
      investment_capacity: "large",
      technology_focus: '["물류자동화", "AI", "IoT", "스마트창고"]',
      competitive_advantages: "중동-아시아 연결 전략적 위치, 정부 물류허브 정책 지원, 대형 항만 인프라",
      contact_person: "Saeed Al-Harthy",
      contact_position: "Operations Director",
      contact_language: '["ar", "en"]',
      preferred_cooperation: '["기술협력", "수입", "합작투자"]',
      company_stage: "growth",
      annual_revenue: "medium",
      export_ratio: 30,
      rd_investment_ratio: 15
    }
  ]
};

// 산업별 맞춤 기술 키워드 및 협력 니즈
const industrySpecificData = {
  ict: {
    keywords: ["AI", "IoT", "빅데이터", "클라우드", "사이버보안", "5G", "엣지컴퓨팅", "블록체인", "AR/VR", "디지털트윈"],
    cooperation_examples: [
      "중동 스마트시티 프로젝트 참여를 위한 IoT 및 AI 솔루션 공급 파트너십",
      "사우디 디지털 전환 프로젝트에서 클라우드 및 사이버보안 기술 협력",
      "UAE 정부의 AI 2071 전략에 부합하는 AI 솔루션 공동 개발",
      "카타르 월드컵 레거시를 활용한 스포츠 테크 및 디지털 솔루션 협력"
    ]
  },
  energy: {
    keywords: ["태양광", "풍력", "ESS", "수소", "스마트그리드", "재생에너지", "에너지효율", "탄소중립", "원자력", "LNG"],
    cooperation_examples: [
      "사우디 NEOM 프로젝트의 100% 재생에너지 공급을 위한 태양광 및 ESS 협력",
      "UAE 에너지 전환 정책에 따른 스마트그리드 및 에너지저장 기술 파트너십",
      "카타르 2030 국가비전의 지속가능한 에너지 개발을 위한 수소 기술 협력",
      "오만 신재생에너지 프로젝트에서 풍력 및 태양광 통합 솔루션 제공"
    ]
  },
  automotive: {
    keywords: ["전기차", "자율주행", "배터리", "충전인프라", "모빌리티", "커넥티드카", "ADAS", "차량보안", "경량소재", "하이브리드"],
    cooperation_examples: [
      "사우디 자동차 산업 육성 정책에 따른 전기차 및 자율주행 기술 이전",
      "UAE 스마트 모빌리티 2030 계획을 위한 커넥티드카 및 충전인프라 구축",
      "카타르 대중교통 현대화 프로젝트에서 친환경 버스 및 모빌리티 솔루션 공급",
      "쿠웨이트 신도시 개발에 필요한 자율주행 셔틀 및 스마트 주차 시스템 협력"
    ]
  },
  finance: {
    keywords: ["핀테크", "블록체인", "디지털뱅킹", "AI금융", "이슬람금융", "디지털결제", "크립토", "리걸테크", "인슈어테크", "로보어드바이저"],
    cooperation_examples: [
      "사우디 Vision 2030 금융 개혁에 따른 디지털 뱅킹 및 핀테크 솔루션 협력",
      "UAE 중앙은행의 디지털 통화 발행을 위한 블록체인 기술 파트너십",
      "카타르 이슬람 금융 허브 구축을 위한 샤리아 준수 핀테크 솔루션 개발",
      "바레인 핀테크 허브를 활용한 중동 지역 디지털 결제 생태계 구축"
    ]
  },
  petrochemical: {
    keywords: ["정유기술", "화학공정", "석유화학", "친환경화학", "바이오화학", "고분자", "촉매기술", "정밀화학", "특수화학", "플라스틱"],
    cooperation_examples: [
      "사우디 아람코와의 석유화학 고도화 및 친환경 공정 기술 협력",
      "UAE 화학산업 다각화를 위한 고부가가치 화학제품 생산 기술 이전",
      "카타르 가스화학 산업 확장에 필요한 정밀화학 및 특수소재 기술 협력",
      "쿠웨이트 석유화학 단지 현대화를 위한 스마트 화학공장 솔루션 제공"
    ]
  },
  healthcare: {
    keywords: ["디지털헬스케어", "AI진단", "원격의료", "의료기기", "바이오기술", "제약", "정밀의료", "의료영상", "헬스케어AI", "의료로봇"],
    cooperation_examples: [
      "사우디 헬스케어 혁신 프로그램을 위한 AI 진단 및 원격의료 기술 협력",
      "UAE 의료관광 확대를 위한 첨단 의료기기 및 디지털 헬스케어 솔루션 공급",
      "카타르 국립의료시스템 디지털화를 위한 의료영상 AI 및 병원정보시스템 협력",
      "바레인 의료산업 허브 구축을 위한 바이오기술 및 제약 연구개발 파트너십"
    ]
  },
  agriculture: {
    keywords: ["스마트팜", "수직농장", "정밀농업", "농업자동화", "IoT센서", "드론농업", "농업AI", "온실기술", "양액재배", "아쿠아포닉스"],
    cooperation_examples: [
      "사우디 농업 다각화 정책에 따른 사막 농업 및 스마트팜 기술 협력",
      "UAE 식량안보 확보를 위한 수직농장 및 정밀농업 솔루션 제공",
      "카타르 자급자족 농업 달성을 위한 온실기술 및 양액재배 시스템 협력",
      "오만 농업 현대화를 위한 드론 기반 정밀농업 및 IoT 관리 시스템 도입"
    ]
  }
};

console.log("Enhanced company matching data prepared");
console.log("Korean companies:", companyEnhancements.korean_companies.length);
console.log("Arab companies:", companyEnhancements.arab_companies.length);
console.log("Industry categories:", Object.keys(industrySpecificData).length);

module.exports = { companyEnhancements, industrySpecificData };