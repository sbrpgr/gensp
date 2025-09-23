// Optimized Data Generator for KABridge
// Generates exactly 600 companies: 300 Korean + 300 Arab
// Fast and efficient with realistic but simple data

const koreanCompanies = [
  // Technology Companies (100 companies)
  ...Array.from({length: 100}, (_, i) => {
    const techNames = [
      '삼성전자', 'LG전자', '네이버', '카카오', 'SK텔레콤', '삼성SDS', '엔씨소프트', '넷마블',
      '크래프톤', '위메이드', '펄어비스', '스마일게이트', '한화시스템', 'LG유플러스', 'KT',
      '바이두코리아', '라인플러스', '우아한형제들', '쿠팡', '야놀자', '마켓컬리', '무신사',
      '당근마켓', '토스', '비바리퍼블리카', '글로벌포인트', 'NHN', '더존비즈온', '안랩',
      '이스트소프트', '한컴', '알티캐스트', '솔트룩스', '뤼이드', '스켈터랩스', 'AI스퀘어',
      '수아랩', '레티널', '딥바이오', '스탠다임', '아이센스', 'KAIST AI', '포스코ICT',
      'SK하이닉스', '현대오토에버', 'LG CNS', '삼성바이오로직스', '셀트리온', 'SK바이오팜',
      '유진투자증권', 'KB증권', 'NH투자증권', '한국투자증권', '미래에셋증권', 'SK증권'
    ];
    
    return {
      name: techNames[i % techNames.length] + (i >= techNames.length ? ` ${Math.floor(i / techNames.length) + 1}` : ''),
      name_en: `${techNames[i % techNames.length].replace(/[가-힣]/g, '')}Tech${i >= techNames.length ? Math.floor(i / techNames.length) + 1 : ''}`,
      country: 'KR',
      industry: 'technology',
      location: ['서울', '경기도', '부산', '대구', '대전', '광주', '인천'][i % 7],
      location_en: ['Seoul', 'Gyeonggi', 'Busan', 'Daegu', 'Daejeon', 'Gwangju', 'Incheon'][i % 7],
      description: `혁신적인 기술 솔루션을 제공하는 대한민국의 선도적인 IT 기업입니다.`,
      description_en: `Leading Korean IT company providing innovative technology solutions.`,
      cooperation_needs: [
        '사우디 스마트시티 프로젝트 참여를 희망합니다',
        'UAE의 핀테크 시장 진출을 위한 현지 파트너를 찾고 있습니다',
        '중동 지역 IoT 솔루션 공급 협력사를 원합니다',
        'AI 기술을 활용한 사우디 헬스케어 시장 진출을 희망합니다',
        '카타르 월드컵 레거시 사업 참여를 원합니다',
        '바레인 블록체인 허브 진출을 위한 협력을 희망합니다'
      ][i % 6],
      established_year: 2000 + (i % 24),
      employee_count: 50 + (i % 500)
    };
  }),

  // Manufacturing Companies (80 companies)
  ...Array.from({length: 80}, (_, i) => {
    const mfgNames = [
      '현대자동차', '기아', '포스코', '현대제철', 'LG화학', 'SK이노베이션', '한화',
      '두산', '현대중공업', '대우조선해양', '삼성중공업', 'HD한국조선해양', 'STX',
      '롯데케미칼', '코오롱', '효성', '대상', 'CJ제일제당', '농심', '오뚜기',
      'GS칼텍스', 'S-Oil', '현대오일뱅크', 'SK에너지', '한국전력', '한국가스공사',
      '두산에너빌리티', '한전기술', '한국수력원자력', 'KHNP', '한국원자력연료',
      '현대건설', '대림산업', 'GS건설', '포스코건설', '대우건설', '롯데건설'
    ];
    
    return {
      name: mfgNames[i % mfgNames.length] + (i >= mfgNames.length ? ` ${Math.floor(i / mfgNames.length) + 1}` : ''),
      name_en: `${mfgNames[i % mfgNames.length].replace(/[가-힣]/g, '')}Corp${i >= mfgNames.length ? Math.floor(i / mfgNames.length) + 1 : ''}`,
      country: 'KR',
      industry: ['manufacturing', 'energy', 'construction'][i % 3],
      location: ['울산', '포항', '여수', '창원', '거제', '통영', '군산'][i % 7],
      location_en: ['Ulsan', 'Pohang', 'Yeosu', 'Changwon', 'Geoje', 'Tongyeong', 'Gunsan'][i % 7],
      description: `글로벌 경쟁력을 갖춘 대한민국의 제조업 선도 기업입니다.`,
      description_en: `Leading Korean manufacturing company with global competitiveness.`,
      cooperation_needs: [
        '사우디 NEOM 프로젝트에 건설장비 공급을 희망합니다',
        'UAE 석유화학 플랜트 건설 참여를 원합니다',
        '이집트 신행정수도 건설 프로젝트 참여를 희망합니다',
        '사우디 비전 2030 제조업 현지화 사업 참여를 원합니다',
        '쿠웨이트 정유공장 현대화 프로젝트 참여를 희망합니다',
        '카타르 LNG 플랜트 유지보수 사업 협력을 원합니다'
      ][i % 6],
      established_year: 1970 + (i % 54),
      employee_count: 500 + (i % 5000)
    };
  }),

  // Healthcare & Bio Companies (60 companies)
  ...Array.from({length: 60}, (_, i) => {
    const healthNames = [
      '삼성바이오로직스', '셀트리온', 'SK바이오팜', '유한양행', '종근당', '한미약품',
      '대웅제약', '일동제약', 'JW생명과학', '휴젤', '메디톡스', '알테오젠',
      'GC녹십자', 'SK플라즈마', 'LG생명과학', '보령제약', '동아에스티', '경동제약'
    ];
    
    return {
      name: healthNames[i % healthNames.length] + (i >= healthNames.length ? ` ${Math.floor(i / healthNames.length) + 1}` : ''),
      name_en: `${healthNames[i % healthNames.length].replace(/[가-힣]/g, '')}Pharma${i >= healthNames.length ? Math.floor(i / healthNames.length) + 1 : ''}`,
      country: 'KR',
      industry: 'healthcare',
      location: ['송도', '오창', '오산', '천안', '청주', '세종'][i % 6],
      location_en: ['Songdo', 'Ochang', 'Osan', 'Cheonan', 'Cheongju', 'Sejong'][i % 6],
      description: `첨단 바이오 기술과 제약 솔루션을 제공하는 헬스케어 전문 기업입니다.`,
      description_en: `Healthcare specialist providing advanced bio-technology and pharmaceutical solutions.`,
      cooperation_needs: [
        '사우디 헬스케어 시장에 K-바이오 제품 수출을 희망합니다',
        'UAE 의료관광 산업 협력 파트너를 찾고 있습니다',
        '이집트 제약 시장 진출을 위한 현지 유통업체와 협력을 원합니다',
        '카타르 병원 현대화 프로젝트 의료기기 공급을 희망합니다',
        '요단 의료진 교육 프로그램 협력을 원합니다',
        '레바논 제약공장 건설 프로젝트 참여를 희망합니다'
      ][i % 6],
      established_year: 1990 + (i % 34),
      employee_count: 100 + (i % 1000)
    };
  }),

  // Food & Agriculture Companies (60 companies)  
  ...Array.from({length: 60}, (_, i) => {
    const foodNames = [
      'CJ제일제당', '농심', '오뚜기', '롯데제과', '해태제과', '동서식품',
      '매일유업', '남양유업', '서울우유', '빙그레', '풀무원', '삼양식품',
      'SPC삼립', '파리바게뜨', '던킨도너츠', '크라운제과', '롯데칠성',
      'KGC인삼공사', '정관장', '천호엔케어', '동원F&B', '사조대림'
    ];
    
    return {
      name: foodNames[i % foodNames.length] + (i >= foodNames.length ? ` ${Math.floor(i / foodNames.length) + 1}` : ''),
      name_en: `${foodNames[i % foodNames.length].replace(/[가-힣]/g, '')}Foods${i >= foodNames.length ? Math.floor(i / foodNames.length) + 1 : ''}`,
      country: 'KR',
      industry: 'food',
      location: ['전주', '익산', '김제', '나주', '영광', '고창'][i % 6],
      location_en: ['Jeonju', 'Iksan', 'Gimje', 'Naju', 'Yeonggwang', 'Gochang'][i % 6],
      description: `한국의 전통과 현대 기술을 접목한 고품질 식품을 생산하는 기업입니다.`,
      description_en: `Company producing high-quality food combining Korean tradition with modern technology.`,
      cooperation_needs: [
        '사우디 할랄 식품 시장 진출을 위한 현지 파트너를 찾고 있습니다',
        'UAE K-푸드 레스토랑 체인 확장을 희망합니다',
        '이집트 라면 공장 건설 프로젝트 협력을 원합니다',
        '카타르 한류 식품 유통망 구축을 희망합니다',
        '쿠웨이트 김치 현지 생산 공장 설립을 원합니다',
        '요단 삼계탕 냉동식품 수출 협력을 희망합니다'
      ][i % 6],
      established_year: 1960 + (i % 64),
      employee_count: 200 + (i % 2000)
    };
  })
];

const arabCompanies = [
  // Saudi Companies (120 companies)
  ...Array.from({length: 120}, (_, i) => {
    const saudiNames = [
      'Saudi Aramco', 'SABIC', 'Al Rajhi Bank', 'STC', 'SAMBA', 'NCB', 'Riyad Bank',
      'Saudi Electricity', 'Maaden', 'ACWA Power', 'Red Sea Global', 'NEOM',
      'Saudi Tourism Authority', 'PIF', 'Tadawul', 'Elm', 'STC Pay', 'Noon',
      'Jarir Marketing', 'Almarai', 'Savola', 'Zamil Group', 'Olayan Group',
      'Al Muhaidib Group', 'Bindawood', 'Lulu Group', 'Carrefour Saudi'
    ];
    
    return {
      name: saudiNames[i % saudiNames.length] + (i >= saudiNames.length ? ` ${Math.floor(i / saudiNames.length) + 1}` : ''),
      name_ar: saudiNames[i % saudiNames.length].replace(/[A-Za-z]/g, '') + 'السعودية',
      country: 'SA',
      industry: ['technology', 'energy', 'finance', 'construction', 'retail'][i % 5],
      location: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Mecca', 'Medina'][i % 6],
      location_ar: ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة', 'المدينة'][i % 6],
      description: `Leading Saudi company driving Vision 2030 transformation and economic diversification.`,
      description_ar: `شركة سعودية رائدة تقود تحول رؤية 2030 والتنويع الاقتصادي`,
      cooperation_needs: [
        '한국 기술 기업과 스마트시티 구축 협력을 원합니다',
        'K-뷰티 브랜드 사우디 진출 파트너십을 희망합니다',
        '한국 자동차 기업과 현지 조립공장 설립을 원합니다',
        'K-컬처 엔터테인먼트 산업 협력을 희망합니다',
        '한국 교육기관과 인재양성 프로그램 협력을 원합니다',
        '삼성·LG와 가전제품 현지화 사업 협력을 희망합니다'
      ][i % 6],
      established_year: 1980 + (i % 44),
      employee_count: 100 + (i % 10000)
    };
  }),

  // UAE Companies (80 companies)
  ...Array.from({length: 80}, (_, i) => {
    const uaeNames = [
      'Emirates NBD', 'ADNOC', 'Etisalat', 'du', 'DP World', 'Emaar',
      'DAMAC', 'Majid Al Futtaim', 'Al Habtoor Group', 'Jumeirah Group',
      'Nakheel', 'Dubai Holding', 'Mubadala', 'ADCB', 'FAB',
      'Careem', 'Talabat', 'Noon UAE', 'Amazon UAE', 'Souq'
    ];
    
    return {
      name: uaeNames[i % uaeNames.length] + (i >= uaeNames.length ? ` ${Math.floor(i / uaeNames.length) + 1}` : ''),
      name_ar: uaeNames[i % uaeNames.length].replace(/[A-Za-z]/g, '') + 'الإمارات',
      country: 'AE',
      industry: ['finance', 'technology', 'construction', 'logistics', 'retail'][i % 5],
      location: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'][i % 5],
      location_ar: ['دبي', 'أبو ظبي', 'الشارقة', 'عجمان', 'رأس الخيمة'][i % 5],
      description: `UAE-based company fostering innovation and business excellence in the Middle East.`,
      description_ar: `شركة إماراتية تعزز الابتكار والتميز التجاري في الشرق الأوسط`,
      cooperation_needs: [
        'K-뷰티 UAE 시장 진출을 위한 한국 파트너를 찾고 있습니다',
        '한국 핀테크 기업과 디지털 결제 솔루션 개발을 원합니다',
        '드라마·K-POP 엔터테인먼트 사업 협력을 희망합니다',
        '한국 스타트업 UAE 진출 지원 플랫폼 구축을 원합니다',
        'e-커머스 플랫폼에 K-브랜드 입점 협력을 희망합니다',
        '한국 의료관광과 UAE 연계 서비스 개발을 원합니다'
      ][i % 6],
      established_year: 1970 + (i % 54),
      employee_count: 50 + (i % 5000)
    };
  }),

  // Egypt Companies (60 companies)
  ...Array.from({length: 60}, (_, i) => {
    const egyptNames = [
      'Commercial International Bank', 'Orascom Construction', 'Talaat Moustafa Group',
      'El Sewedy Electric', 'Arabian Cement', 'Ezz Steel', 'Palm Hills',
      'Vodafone Egypt', 'Orange Egypt', 'We Telecom Egypt', 'Fawry',
      'Swvl', 'Vezeeta', 'Wuzzuf', 'Elmenus'
    ];
    
    return {
      name: egyptNames[i % egyptNames.length] + (i >= egyptNames.length ? ` ${Math.floor(i / egyptNames.length) + 1}` : ''),
      name_ar: egyptNames[i % egyptNames.length].replace(/[A-Za-z]/g, '') + 'مصر',
      country: 'EG',
      industry: ['construction', 'technology', 'manufacturing', 'finance'][i % 4],
      location: ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh'][i % 4],
      location_ar: ['القاهرة', 'الإسكندرية', 'الجيزة', 'شرم الشيخ'][i % 4],
      description: `Egyptian company contributing to economic growth and regional development.`,
      description_ar: `شركة مصرية تساهم في النمو الاقتصادي والتنمية الإقليمية`,
      cooperation_needs: [
        '한국 건설사와 신행정수도 프로젝트 협력을 원합니다',
        'K-드라마 현지 제작 및 배급 파트너십을 희망합니다',
        '한국 농업기술 이집트 도입을 위한 협력을 원합니다',
        '수에즈운하 경제구역 한국기업 유치 협력을 희망합니다',
        '이집트 관광산업에 한류 콘텐츠 활용 협력을 원합니다',
        '태양광 발전소 건설을 위한 한국 기업과의 협력을 희망합니다'
      ][i % 6],
      established_year: 1960 + (i % 64),
      employee_count: 200 + (i % 3000)
    };
  }),

  // Other Arab Countries (40 companies total - Jordan, Lebanon, Qatar, etc.)
  ...Array.from({length: 40}, (_, i) => {
    const countries = ['JO', 'LB', 'QA', 'BH', 'KW', 'OM'];
    const countryNames = ['Jordan', 'Lebanon', 'Qatar', 'Bahrain', 'Kuwait', 'Oman'];
    const arabNames = ['الأردن', 'لبنان', 'قطر', 'البحرين', 'الكويت', 'عمان'];
    
    const companyNames = [
      'Arab Bank', 'Bank Audi', 'QNB', 'NBK', 'Gulf Bank', 'Bank Muscat',
      'Zain Group', 'Ooredoo', 'Batelco', 'STC Bahrain', 'Omantel',
      'Agility', 'Aramex', 'Flynas', 'Gulf Air', 'Qatar Airways'
    ];
    
    const countryIndex = i % countries.length;
    
    return {
      name: companyNames[i % companyNames.length] + (i >= companyNames.length ? ` ${Math.floor(i / companyNames.length) + 1}` : ''),
      name_ar: companyNames[i % companyNames.length].replace(/[A-Za-z]/g, '') + arabNames[countryIndex],
      country: countries[countryIndex],
      industry: ['finance', 'logistics', 'technology', 'energy'][i % 4],
      location: countryNames[countryIndex] + ' City',
      location_ar: arabNames[countryIndex],
      description: `Leading company in ${countryNames[countryIndex]} driving regional business growth.`,
      description_ar: `شركة رائدة في ${arabNames[countryIndex]} تقود النمو التجاري الإقليمي`,
      cooperation_needs: [
        '한국 IT 기업과 디지털 트랜스포메이션 협력을 원합니다',
        'K-뷰티 브랜드 중동 유통 파트너십을 희망합니다',
        '한국 물류 시스템 도입을 위한 기술 협력을 원합니다',
        '신재생에너지 프로젝트 한국 기업 협력을 희망합니다',
        '한국 교육 콘텐츠 현지화 사업 협력을 원합니다',
        'K-컬처 현지 마케팅 및 이벤트 기획 협력을 희망합니다'
      ][i % 6],
      established_year: 1970 + (i % 54),
      employee_count: 100 + (i % 2000)
    };
  })
];

// Combine all companies
const allCompanies = [...koreanCompanies, ...arabCompanies];

console.log(`Generated ${allCompanies.length} companies:`);
console.log(`- Korean companies: ${koreanCompanies.length}`);
console.log(`- Arab companies: ${arabCompanies.length}`);

module.exports = allCompanies;