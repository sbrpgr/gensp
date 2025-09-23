// KABridge - Test companies insertion via API

const companies = [
  {
    name: "삼성전자",
    name_en: "Samsung Electronics", 
    name_ar: "سامسونغ إلكترونيكس",
    country: "KR",
    industry: "ict",
    size: "large",
    location: "수원",
    location_en: "Suwon", 
    location_ar: "سوون",
    employees: 45000,
    founded: 1969,
    website: "https://www.samsung.com",
    contact_email: "contact@samsung.com",
    description: "삼성전자는 IT/ICT 분야의 선도 기업으로, 혁신적인 기술과 우수한 품질의 제품 및 서비스를 제공합니다.",
    description_en: "Samsung Electronics is a leading company in the IT/ICT sector, providing innovative technology and high-quality products and services.",
    description_ar: "سامسونغ إلكترونيكس هي شركة رائدة في قطاع تكنولوجيا المعلومات والاتصالات، وتقدم التكنولوجيا المبتكرة والمنتجات والخدمات عالية الجودة.",
    products: "스마트폰, 반도체, AI솔루션",
    products_en: "Smartphones, Semiconductors, AI Solutions", 
    products_ar: "الهواتف الذكية, أشباه الموصلات, حلول الذكاء الاصطناعي",
    cooperation_types: "수출, 합작투자, 기술이전",
    cooperation_types_en: "Export, Joint Venture, Technology Transfer",
    cooperation_types_ar: "التصدير, المشروع المشترك, نقل التكنولوجيا",
    target_countries: "SA,AE,QA"
  },
  {
    name: "현대자동차",
    name_en: "Hyundai Motor",
    name_ar: "هيونداي موتور", 
    country: "KR",
    industry: "automotive",
    size: "large",
    location: "서울",
    location_en: "Seoul",
    location_ar: "سيول",
    employees: 75000,
    founded: 1967,
    website: "https://www.hyundai.com",
    contact_email: "contact@hyundai.com", 
    description: "현대자동차는 자동차 분야의 선도 기업으로, 혁신적인 기술과 우수한 품질의 제품 및 서비스를 제공합니다.",
    description_en: "Hyundai Motor is a leading company in the Automotive sector, providing innovative technology and high-quality products and services.",
    description_ar: "هيونداي موتور هي شركة رائدة في قطاع السيارات، وتقدم التكنولوجيا المبتكرة والمنتجات والخدمات عالية الجودة.",
    products: "전기차, 하이브리드차, 자율주행차",
    products_en: "Electric Vehicles, Hybrid Cars, Autonomous Vehicles",
    products_ar: "السيارات الكهربائية, السيارات الهجينة, السيارات ذاتية القيادة",
    cooperation_types: "수출, 합작투자, 라이센싱", 
    cooperation_types_en: "Export, Joint Venture, Licensing",
    cooperation_types_ar: "التصدير, المشروع المشترك, الترخيص",
    target_countries: "SA,AE,KW"
  },
  {
    name: "사우디 아람코",
    name_en: "Saudi Aramco",
    name_ar: "أرامكو السعودية",
    country: "SA", 
    industry: "energy",
    size: "large",
    location: "다란",
    location_en: "Dhahran",
    location_ar: "الظهران",
    employees: 70000,
    founded: 1933,
    website: "https://www.aramco.com",
    contact_email: "contact@aramco.com",
    description: "사우디 아람코는 에너지 분야의 선도 기업으로, 혁신적인 기술과 우수한 품질의 제품 및 서비스를 제공합니다.",
    description_en: "Saudi Aramco is a leading company in the Energy sector, providing innovative technology and high-quality products and services.",
    description_ar: "أرامكو السعودية هي شركة رائدة في قطاع الطاقة، وتقدم التكنولوجيا المبتكرة والمنتجات والخدمات عالية الجودة.",
    products: "석유가스, 에너지저장, 스마트그리드",
    products_en: "Oil & Gas, Energy Storage, Smart Grid", 
    products_ar: "النفط والغاز, تخزين الطاقة, الشبكة الذكية",
    cooperation_types: "수출, 수입, 기술이전",
    cooperation_types_en: "Export, Import, Technology Transfer",
    cooperation_types_ar: "التصدير, الاستيراد, نقل التكنولوجيا", 
    target_countries: "KR"
  },
  {
    name: "에미레이츠 그룹",
    name_en: "Emirates Group",
    name_ar: "مجموعة الإمارات",
    country: "AE",
    industry: "aviation", 
    size: "large",
    location: "두바이",
    location_en: "Dubai",
    location_ar: "دبي",
    employees: 60000,
    founded: 1985,
    website: "https://www.emiratesgroup.com",
    contact_email: "contact@emiratesgroup.com",
    description: "에미레이츠 그룹은 항공 분야의 선도 기업으로, 혁신적인 기술과 우수한 품질의 제품 및 서비스를 제공합니다.",
    description_en: "Emirates Group is a leading company in the Aviation sector, providing innovative technology and high-quality products and services.",
    description_ar: "مجموعة الإمارات هي شركة رائدة في قطاع الطيران، وتقدم التكنولوجيا المبتكرة والمنتجات والخدمات عالية الجودة.",
    products: "항공운송, 화물운송, 항공유지보수",
    products_en: "Air Transport, Cargo Transport, Aircraft Maintenance",
    products_ar: "النقل الجوي, نقل البضائع, صيانة الطائرات",
    cooperation_types: "수출, 수입, 유통협력",
    cooperation_types_en: "Export, Import, Distribution",
    cooperation_types_ar: "التصدير, الاستيراد, التوزيع",
    target_countries: "KR"
  }
];

async function insertCompanies() {
  console.log('🚀 Inserting test companies via API...');
  
  try {
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      console.log(`📤 Inserting ${company.name}...`);
      
      const response = await fetch('http://localhost:3000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(company)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${company.name} inserted successfully (ID: ${result.id})`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to insert ${company.name}: ${error}`);
      }
    }
    
    console.log('🎉 All companies inserted successfully!');
    
  } catch (error) {
    console.error('💥 Error inserting companies:', error);
  }
}

insertCompanies();