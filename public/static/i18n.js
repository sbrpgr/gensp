// KABridge 다국어 지원 시스템 (한국어 ↔ 아랍어)

// 번역 데이터
const translations = {
  ko: {
    // 네비게이션
    platform_title: "KABridge",
    platform_subtitle: "한국-아랍 기업 매칭 플랫폼",
    nav_search: "기업 탐색",
    nav_register: "기업 등록", 
    nav_requests: "협력 요청",
    nav_community: "커뮤니티",
    
    // 홈페이지
    hero_title: "한국과 아랍 기업을 연결하는 글로벌 비즈니스 플랫폼",
    hero_subtitle: "직관적인 매칭 시스템으로 새로운 비즈니스 파트너를 찾아보세요",
    btn_explore: "기업 탐색하기",
    btn_register: "기업 등록하기",
    
    // 특징 섹션
    why_kabridge: "왜 KABridge를 선택해야 할까요?",
    feature_search_title: "직관적인 탐색",
    feature_search_desc: "채용 플랫폼처럼 쉽고 간편한 기업 검색과 필터링",
    feature_matching_title: "신뢰할 수 있는 매칭",
    feature_matching_desc: "검증된 기업 프로필과 안전한 협력 요청 시스템", 
    feature_network_title: "글로벌 네트워크",
    feature_network_desc: "한국과 아랍 지역의 다양한 산업 파트너 연결",
    
    // 기업 섹션
    recent_companies: "최근 등록 기업",
    view_all: "전체 보기 →",
    
    // 커뮤니티 섹션
    community_trending: "커뮤니티 인기글",
    community_subtitle: "한국-아랍 비즈니스 인사이트와 경험을 공유해보세요",
    community_cta_title: "KABridge 커뮤니티에 참여하세요",
    community_cta_desc: "한국과 아랍 지역의 비즈니스 전문가들과 네트워킹하고, 시장 인사이트를 공유하며 새로운 기회를 발견해보세요.",
    btn_browse_community: "커뮤니티 둘러보기",
    btn_write_post: "글 작성하기",
    
    // 기업 정보
    company_employees: "명",
    company_founded: "설립년도",
    company_website: "웹사이트", 
    company_contact: "연락처",
    company_description: "기업 설명",
    company_products: "제품/서비스",
    company_cooperation: "협력 유형",
    btn_view_details: "상세보기 →",
    
    // 검색 및 필터
    search_companies: "기업 검색",
    filter_country: "국가",
    filter_industry: "산업",
    filter_size: "기업규모",
    search_placeholder: "기업명, 제품, 키워드로 검색...",
    
    // 공통
    no_data: "정보 없음",
    loading: "불러오는 중...",
    error: "오류가 발생했습니다",
    
    // 국가명
    countries: {
      KR: "대한민국",
      AE: "아랍에미리트", 
      SA: "사우디아라비아",
      QA: "카타르",
      KW: "쿠웨이트",
      BH: "바레인",
      OM: "오만",
      JO: "요단",
      EG: "이집트"
    },
    
    // 산업명
    industries: {
      ict: "IT/ICT",
      energy: "에너지",
      automotive: "자동차", 
      petrochemical: "석유화학",
      finance: "금융",
      aviation: "항공",
      construction: "건설",
      healthcare: "헬스케어",
      other: "기타"
    }
  },
  
  ar: {
    // التنقل
    platform_title: "KABridge",
    platform_subtitle: "منصة ربط الشركات الكورية العربية",
    nav_search: "استكشاف الشركات",
    nav_register: "تسجيل الشركة",
    nav_requests: "طلبات التعاون", 
    nav_community: "المجتمع",
    
    // الصفحة الرئيسية
    hero_title: "منصة الأعمال العالمية لربط الشركات الكورية والعربية",
    hero_subtitle: "اعثر على شركاء أعمال جدد بنظام مطابقة بديهي",
    btn_explore: "استكشاف الشركات",
    btn_register: "تسجيل الشركة",
    
    // قسم الميزات
    why_kabridge: "لماذا تختار KABridge؟",
    feature_search_title: "استكشاف بديهي",
    feature_search_desc: "البحث والتصفية السهل للشركات مثل منصات التوظيف",
    feature_matching_title: "مطابقة موثوقة",
    feature_matching_desc: "ملفات تعريف شركات محققة ونظام طلبات تعاون آمن",
    feature_network_title: "شبكة عالمية", 
    feature_network_desc: "ربط شركاء صناعيين متنوعين في كوريا والمنطقة العربية",
    
    // قسم الشركات
    recent_companies: "الشركات المسجلة حديثاً",
    view_all: "عرض الكل ←",
    
    // قسم المجتمع
    community_trending: "المنشورات الرائجة في المجتمع",
    community_subtitle: "شارك رؤى وخبرات الأعمال الكورية العربية",
    community_cta_title: "انضم إلى مجتمع KABridge",
    community_cta_desc: "تواصل مع خبراء الأعمال في كوريا والمنطقة العربية، وشارك رؤى السوق واكتشف فرص جديدة.",
    btn_browse_community: "تصفح المجتمع",
    btn_write_post: "كتابة منشور",
    
    // معلومات الشركة
    company_employees: "موظف",
    company_founded: "سنة التأسيس",
    company_website: "الموقع الإلكتروني",
    company_contact: "الاتصال", 
    company_description: "وصف الشركة",
    company_products: "المنتجات/الخدمات",
    company_cooperation: "نوع التعاون",
    btn_view_details: "عرض التفاصيل ←",
    
    // البحث والتصفية
    search_companies: "البحث عن الشركات",
    filter_country: "البلد",
    filter_industry: "الصناعة",
    filter_size: "حجم الشركة",
    search_placeholder: "البحث باسم الشركة، المنتج، الكلمات المفتاحية...",
    
    // عام
    no_data: "لا توجد معلومات",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    
    // أسماء البلدان
    countries: {
      KR: "كوريا الجنوبية",
      AE: "الإمارات العربية المتحدة",
      SA: "المملكة العربية السعودية", 
      QA: "قطر",
      KW: "الكويت",
      BH: "البحرين",
      OM: "عُمان",
      JO: "الأردن",
      EG: "مصر"
    },
    
    // أسماء الصناعات
    industries: {
      ict: "تكنولوجيا المعلومات والاتصالات",
      energy: "الطاقة",
      automotive: "السيارات",
      petrochemical: "البتروكيماويات", 
      finance: "المالية",
      aviation: "الطيران",
      construction: "البناء",
      healthcare: "الرعاية الصحية",
      other: "أخرى"
    }
  }
};

// 현재 언어 상태
let currentLanguage = 'ko';

// 초기화
function initializeI18n() {
  // 저장된 언어 설정 불러오기
  const savedLanguage = localStorage.getItem('kabridge_language');
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
  } else {
    // 브라우저 언어 감지
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith('ar')) {
      currentLanguage = 'ar';
    } else {
      currentLanguage = 'ko';
    }
  }
  
  // 초기 언어 설정 적용
  setLanguage(currentLanguage);
}

// 언어 변경
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Language ${lang} not supported`);
    return;
  }
  
  currentLanguage = lang;
  localStorage.setItem('kabridge_language', lang);
  
  // 페이지 방향 설정 (아랍어는 RTL)
  document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang === 'ar' ? 'ar' : 'ko';
  
  // 번역 적용
  updateTranslations();
  
  // 사용자 정의 이벤트 발송
  window.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { language: lang, isRTL: lang === 'ar' } 
  }));
}

// 번역 텍스트 가져오기
function t(key, fallback = key) {
  return translations[currentLanguage]?.[key] || translations['ko']?.[key] || fallback;
}

// DOM 요소 번역 업데이트
function updateTranslations() {
  // data-i18n 속성을 가진 모든 요소 업데이트
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const keys = element.getAttribute('data-i18n').split(',');
    
    keys.forEach(key => {
      const trimmedKey = key.trim();
      
      // 플레이스홀더 업데이트
      if (element.placeholder !== undefined) {
        element.placeholder = t(trimmedKey);
      }
      // 텍스트 콘텐츠 업데이트  
      else if (element.textContent !== undefined) {
        element.textContent = t(trimmedKey);
      }
      // title 속성 업데이트
      else if (element.title !== undefined) {
        element.title = t(trimmedKey);
      }
    });
  });
  
  // 동적 콘텐츠 업데이트
  updateDynamicContent();
}

// 동적 콘텐츠 업데이트 (API에서 로드된 데이터)
function updateDynamicContent() {
  // 기업 카드 업데이트
  updateCompanyCards();
  
  // 커뮤니티 포스트 업데이트
  updateCommunityPosts();
}

// 기업 카드 번역 업데이트
function updateCompanyCards() {
  const companyCards = document.querySelectorAll('.company-card');
  
  companyCards.forEach(card => {
    // 기업명 업데이트
    const nameElement = card.querySelector('.company-name');
    if (nameElement && nameElement.dataset.names) {
      try {
        const names = JSON.parse(nameElement.dataset.names);
        nameElement.textContent = currentLanguage === 'ar' ? names.ar : 
                                  currentLanguage === 'ko' ? names.ko : names.en;
      } catch (e) {
        console.warn('Error parsing company names:', e);
      }
    }
    
    // 설명 업데이트
    const descElement = card.querySelector('.company-description');
    if (descElement && descElement.dataset.descriptions) {
      try {
        const descriptions = JSON.parse(descElement.dataset.descriptions);
        descElement.textContent = currentLanguage === 'ar' ? descriptions.ar :
                                 currentLanguage === 'ko' ? descriptions.ko : descriptions.en;
      } catch (e) {
        console.warn('Error parsing company descriptions:', e);
      }
    }
    
    // 위치 업데이트  
    const locationElement = card.querySelector('.company-location');
    if (locationElement && locationElement.dataset.locations) {
      try {
        const locations = JSON.parse(locationElement.dataset.locations);
        const locationText = currentLanguage === 'ar' ? locations.ar :
                           currentLanguage === 'ko' ? locations.ko : locations.en;
        // 업데이트된 위치 텍스트에 산업 정보도 포함
        const industryText = locationElement.textContent.includes('•') ? 
                           locationElement.textContent.split('•')[1] : '';
        locationElement.textContent = locationText + (industryText ? ' • ' + industryText : '');
      } catch (e) {
        console.warn('Error parsing company locations:', e);
      }
    }
  });
}

// 커뮤니티 포스트 업데이트
function updateCommunityPosts() {
  // 커뮤니티 관련 동적 콘텐츠가 있다면 여기서 업데이트
}

// 언어 선택기 생성
function createLanguageSelector() {
  return `
    <div class="relative inline-block text-left">
      <button 
        type="button" 
        class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
        id="language-menu-button" 
        onclick="toggleLanguageMenu()"
      >
        ${currentLanguage === 'ar' ? '🇸🇦 العربية' : '🇰🇷 한국어'}
        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div 
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" 
        id="language-menu" 
        style="display: none;"
      >
        <div class="py-1" role="menu">
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="selectLanguage('ko')" role="menuitem">
            <div class="flex items-center">
              <span class="mr-2">🇰🇷</span>
              <span>한국어</span>
              ${currentLanguage === 'ko' ? '<span class="ml-auto text-blue-600">✓</span>' : ''}
            </div>
          </a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="selectLanguage('ar')" role="menuitem">
            <div class="flex items-center">
              <span class="mr-2">🇸🇦</span>
              <span>العربية</span>
              ${currentLanguage === 'ar' ? '<span class="ml-auto text-blue-600">✓</span>' : ''}
            </div>
          </a>
        </div>
      </div>
    </div>
  `;
}

// 언어 메뉴 토글
function toggleLanguageMenu() {
  const menu = document.getElementById('language-menu');
  if (menu) {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }
}

// 언어 선택
function selectLanguage(lang) {
  setLanguage(lang);
  
  // 언어 선택기 업데이트
  const container = document.getElementById('language-selector-container');
  if (container) {
    container.innerHTML = createLanguageSelector();
  }
  
  // 메뉴 닫기
  const menu = document.getElementById('language-menu');
  if (menu) {
    menu.style.display = 'none';
  }
}

// 유틸리티 함수들
function getCountryName(countryCode) {
  return t(`countries.${countryCode}`) || countryCode;
}

function getIndustryName(industryCode) {
  return t(`industries.${industryCode}`) || industryCode;
}

// 메뉴 외부 클릭시 닫기
document.addEventListener('click', function(event) {
  const menu = document.getElementById('language-menu');
  const button = document.getElementById('language-menu-button');
  
  if (menu && button && !menu.contains(event.target) && !button.contains(event.target)) {
    menu.style.display = 'none';
  }
});

// 전역 함수로 노출
window.t = t;
window.setLanguage = setLanguage;
window.createLanguageSelector = createLanguageSelector;
window.toggleLanguageMenu = toggleLanguageMenu;
window.selectLanguage = selectLanguage;
window.getCountryName = getCountryName;
window.getIndustryName = getIndustryName;

// 초기화 실행
initializeI18n();