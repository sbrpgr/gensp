import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Enhanced AI Matching Logic - More realistic filtering and scoring
async function performAIMatching(env: any, userNeeds: string, userCountry: string = 'KR') {
  try {
    // Advanced keyword extraction and analysis
    const keywords = userNeeds.toLowerCase()
      .replace(/[^\w\s가-힣아-이]/g, ' ')
      .split(/\s+/)
      .filter((word: string) => word.length > 1)
    
    // Industry mapping from user query
    const industryKeywords = {
      'technology': ['기술', '테크', '앱', '소프트웨어', '핀테크', 'fintech', 'tech', 'app', 'software', 'ai', 'iot'],
      'manufacturing': ['제조', '생산', '공장', '제품', 'manufacturing', 'factory', 'production'],
      'healthcare': ['헬스케어', '의료', '건강', '병원', 'healthcare', 'medical', 'health', 'hospital'],
      'food': ['음식', '식품', '푸드', 'k-푸드', 'food', 'restaurant', 'beverage'],
      'energy': ['에너지', '전력', '태양광', '신재생', 'energy', 'solar', 'renewable'],
      'construction': ['건설', '부동산', '건축', 'construction', 'building', 'real estate'],
      'finance': ['금융', '투자', '펀드', 'finance', 'investment', 'fund'],
      'education': ['교육', '학습', '트레이닝', 'education', 'learning', 'training'],
      'logistics': ['물류', '배송', '운송', 'logistics', 'shipping', 'delivery'],
      'retail': ['소매', '유통', '매장', 'retail', 'store', 'shop']
    };
    
    // Country/region mapping
    const regionKeywords = {
      'SA': ['사우디', '리야드', 'saudi', 'riyadh'],
      'AE': ['uae', 'dubai', '두바이', '아부다비', 'emirates'],
      'EG': ['이집트', '카이로', 'egypt', 'cairo'],
      'JO': ['요단', '암만', 'jordan', 'amman'],
      'QA': ['카타르', '도하', 'qatar', 'doha'],
      'KW': ['쿠웨이트', 'kuwait'],
      'BH': ['바레인', 'bahrain'],
      'OM': ['오만', 'oman']
    };
    
    // Detect target industries
    const targetIndustries = [];
    for (const [industry, words] of Object.entries(industryKeywords)) {
      if (words.some(word => userNeeds.toLowerCase().includes(word))) {
        targetIndustries.push(industry);
      }
    }
    
    // Detect target countries
    const targetCountries = [];
    for (const [country, words] of Object.entries(regionKeywords)) {
      if (words.some(word => userNeeds.toLowerCase().includes(word))) {
        targetCountries.push(country);
      }
    }
    
    let whereConditions = ['status = ?'];
    let params: any[] = ['active'];
    
    // Smart country filtering based on user country and query
    if (userCountry === 'KR') {
      if (targetCountries.length > 0) {
        whereConditions.push(`country IN (${targetCountries.map(() => '?').join(',')})`);
        params.push(...targetCountries);
      } else {
        whereConditions.push('country != ?');
        params.push('KR');
      }
    } else {
      whereConditions.push('country = ?');
      params.push('KR');
    }
    
    // Advanced text matching
    if (keywords.length > 0) {
      const keywordConditions = keywords.map(() => 
        '(LOWER(cooperation_needs) LIKE ? OR LOWER(description) LIKE ? OR LOWER(name) LIKE ? OR LOWER(industry) LIKE ?)'
      ).join(' OR ');
      
      if (keywordConditions) {
        whereConditions.push(`(${keywordConditions})`);
        keywords.forEach(keyword => {
          params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        });
      }
    }
    
    // Industry filtering if detected
    if (targetIndustries.length > 0) {
      whereConditions.push(`industry IN (${targetIndustries.map(() => '?').join(',')})`);
      params.push(...targetIndustries);
    }
    
    const query = `
      SELECT *,
        (CASE WHEN country = 'KR' THEN 'Korean Company' ELSE 'Arab Company' END) as company_type
      FROM companies 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY RANDOM()
      LIMIT 15
    `;
    
    const result = await env.DB.prepare(query).bind(...params).all();
    
    const matches = result.results.map((company: any) => {
      let score = 60; // Base score
      const companyText = `${company.cooperation_needs} ${company.description} ${company.name}`.toLowerCase();
      
      // Keyword matching (더 정교한 점수 계산)
      const matchedKeywords = keywords.filter(keyword => 
        companyText.includes(keyword)
      );
      score += matchedKeywords.length * 8;
      
      // Industry bonus (사용자 요청과 일치하는 산업)
      if (targetIndustries.includes(company.industry)) {
        score += 20;
      }
      
      // Country preference bonus
      if (targetCountries.includes(company.country)) {
        score += 15;
      }
      
      // Industry-specific bonuses
      const industryBonuses = {
        'technology': 12,
        'manufacturing': 10,
        'healthcare': 8,
        'energy': 10,
        'finance': 7
      };
      score += industryBonuses[company.industry] || 5;
      
      // Company size bonus (직원 수 기반)
      if (company.employee_count) {
        const employeeCount = parseInt(company.employee_count);
        if (employeeCount > 1000) score += 8;
        else if (employeeCount > 100) score += 5;
        else if (employeeCount > 50) score += 3;
      }
      
      // Random factor for realistic variation
      score += Math.floor(Math.random() * 10) - 5;
      score = Math.max(65, Math.min(98, score)); // 65-98 범위로 제한
      
      // Enhanced matching explanation
      let explanation = '';
      if (matchedKeywords.length > 0) {
        explanation += `키워드 매칭: ${matchedKeywords.slice(0, 3).join(', ')} `;
      }
      if (targetIndustries.includes(company.industry)) {
        explanation += `산업 일치: ${company.industry} `;
      }
      if (targetCountries.includes(company.country)) {
        explanation += `지역 타겟 매칭 `;
      }
      explanation += `${company.company_type} 협력 최적화`;
      
      return {
        ...company,
        matching_score: score,
        matching_explanation: explanation || `${company.company_type} 협력 우수한 파트너`
      };
    });
    
    // Sort by score and return top 10
    return matches
      .sort((a, b) => b.matching_score - a.matching_score)
      .slice(0, 10);
    
  } catch (error) {
    console.error('AI Matching error:', error);
    return [];
  }
}

// API Routes
app.get('/api/companies', async (c) => {
  try {
    const { env } = c;
    const url = new URL(c.req.url);
    
    const search = url.searchParams.get('search') || '';
    const country = url.searchParams.get('country') || '';
    const excludeCountry = url.searchParams.get('exclude_country') || '';
    const industry = url.searchParams.get('industry') || '';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    let whereConditions = ['status = ?'];
    let params: any[] = ['active'];
    
    if (country && country !== '') {
      whereConditions.push('country = ?');
      params.push(country);
    }
    
    if (excludeCountry && excludeCountry !== '') {
      whereConditions.push('country != ?');
      params.push(excludeCountry);
    }
    
    if (industry && industry !== '') {
      whereConditions.push('industry = ?');
      params.push(industry);
    }
    
    if (search && search.trim() !== '') {
      whereConditions.push(`(
        LOWER(name) LIKE ? OR 
        LOWER(description) LIKE ? OR 
        LOWER(cooperation_needs) LIKE ?
      )`);
      const searchTerm = `%${search.toLowerCase()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countQuery = `SELECT COUNT(*) as total FROM companies WHERE ${whereConditions.join(' AND ')}`;
    const countResult = await env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult?.total || 0;
    
    // Language-based sorting for better content prioritization
    const lang = url.searchParams.get('lang') || 'ko';
    let orderClause = '';
    
    if (lang === 'ko' && !country && !excludeCountry) {
      // Korean interface: prioritize Korean companies first
      orderClause = 'ORDER BY (CASE WHEN country = "KR" THEN 0 ELSE 1 END), created_at DESC';
    } else if (lang === 'ar' && !country && !excludeCountry) {
      // Arabic interface: prioritize Arab companies first
      orderClause = 'ORDER BY (CASE WHEN country != "KR" THEN 0 ELSE 1 END), created_at DESC';
    } else {
      orderClause = 'ORDER BY created_at DESC';
    }
    
    const companiesQuery = `
      SELECT * FROM companies 
      WHERE ${whereConditions.join(' AND ')}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;
    
    const result = await env.DB.prepare(companiesQuery)
      .bind(...params, limit, offset)
      .all();
    
    await env.DB.prepare(`
      INSERT INTO search_logs (search_query, filter_country, filter_industry, results_count)
      VALUES (?, ?, ?, ?)
    `).bind(search, country, industry, result.results.length).run();
    
    return c.json({
      companies: result.results,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      hasMore: offset + limit < total
    });
    
  } catch (error) {
    console.error('Companies API error:', error);
    return c.json({ error: 'Failed to fetch companies', companies: [], total: 0 }, 500);
  }
});

app.post('/api/ai-matching', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();
    
    const { cooperation_purpose, user_country = 'KR' } = body;
    
    if (!cooperation_purpose || cooperation_purpose.trim().length === 0) {
      return c.json({ error: 'Cooperation purpose is required' }, 400);
    }
    
    const matches = await performAIMatching(env, cooperation_purpose, user_country);
    
    return c.json({
      matches,
      total: matches.length,
      query: cooperation_purpose
    });
    
  } catch (error) {
    console.error('AI Matching API error:', error);
    return c.json({ error: 'AI matching failed', matches: [] }, 500);
  }
});

// Community Posts API
app.get('/api/posts', async (c) => {
  try {
    const { env } = c;
    const url = new URL(c.req.url);
    
    const category = url.searchParams.get('category') || '';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    let whereConditions = ['status = ?'];
    let params: any[] = ['active'];
    
    if (category && category !== '') {
      whereConditions.push('category = ?');
      params.push(category);
    }
    
    const query = `
      SELECT * FROM posts 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY status DESC, created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const result = await env.DB.prepare(query)
      .bind(...params, limit, offset)
      .all();
    
    return c.json({
      posts: result.results,
      hasMore: result.results.length === limit
    });
    
  } catch (error) {
    console.error('Posts API error:', error);
    return c.json({ error: 'Failed to fetch posts', posts: [] }, 500);
  }
});

// Create new post API
app.post('/api/posts', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();
    
    const {
      title, title_en, title_ar,
      content, content_en, content_ar,
      author_name, author_company, author_country,
      category = 'general'
    } = body;
    
    if (!title || !content || !author_name || !author_country) {
      return c.json({ error: 'Required fields missing' }, 400);
    }
    
    const result = await env.DB.prepare(`
      INSERT INTO posts (
        title, title_en, title_ar,
        content, content_en, content_ar,
        author_name, author_company, author_country,
        category, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      title, title_en, title_ar,
      content, content_en, content_ar,
      author_name, author_company, author_country,
      category, 'active'
    ).run();
    
    return c.json({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'Post created successfully'
    });
    
  } catch (error) {
    console.error('Create Post error:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

// Matching Requests API
app.get('/api/matching-requests', async (c) => {
  try {
    const { env } = c;
    const url = new URL(c.req.url);
    
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    const query = `
      SELECT * FROM matching_requests 
      WHERE status = 'active'
      ORDER BY priority DESC, created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const result = await env.DB.prepare(query)
      .bind(limit, offset)
      .all();
    
    return c.json({
      requests: result.results,
      hasMore: result.results.length === limit
    });
    
  } catch (error) {
    console.error('Matching Requests API error:', error);
    return c.json({ error: 'Failed to fetch matching requests', requests: [] }, 500);
  }
});

app.post('/api/matching-requests', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();
    
    const {
      requester_name, requester_company, requester_country, business_type,
      cooperation_purpose, target_countries, target_industries,
      budget_range, timeline, contact_email, priority = 'normal'
    } = body;
    
    if (!requester_name || !cooperation_purpose || !requester_country) {
      return c.json({ error: 'Required fields missing' }, 400);
    }
    
    const result = await env.DB.prepare(`
      INSERT INTO matching_requests (
        requester_name, requester_company, requester_country, business_type,
        cooperation_purpose, target_countries, target_industries,
        budget_range, timeline, contact_email, priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      requester_name, requester_company, requester_country, business_type,
      cooperation_purpose, JSON.stringify(target_countries || []),
      JSON.stringify(target_industries || []),
      budget_range, timeline, contact_email, priority
    ).run();
    
    return c.json({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'Matching request created successfully'
    });
    
  } catch (error) {
    console.error('Create Matching Request error:', error);
    return c.json({ error: 'Failed to create matching request' }, 500);
  }
});

app.post('/api/bulk-insert', async (c) => {
  try {
    const { env } = c;
    const companies = require('../generate_optimized_data.cjs');
    
    let inserted = 0;
    const batchSize = 50;
    
    for (let i = 0; i < companies.length; i += batchSize) {
      const batch = companies.slice(i, i + batchSize);
      
      for (const company of batch) {
        try {
          await env.DB.prepare(`
            INSERT INTO companies (
              name, name_en, name_ar, country, industry, location, location_en, location_ar,
              description, description_en, description_ar, cooperation_needs, cooperation_needs_en, cooperation_needs_ar,
              contact_email, website, phone, established_year, employee_count, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            company.name, company.name_en || null, company.name_ar || null,
            company.country, company.industry,
            company.location, company.location_en || null, company.location_ar || null,
            company.description, company.description_en || null, company.description_ar || null,
            company.cooperation_needs, company.cooperation_needs_en || null, company.cooperation_needs_ar || null,
            company.contact_email || null, company.website || null, company.phone || null,
            company.established_year || null, company.employee_count || null, 'active'
          ).run();
          
          inserted++;
        } catch (insertError) {
          console.error(`Failed to insert company ${company.name}:`, insertError);
        }
      }
    }
    
    return c.json({ 
      message: `Successfully inserted ${inserted} companies`,
      total: companies.length,
      success_rate: `${((inserted / companies.length) * 100).toFixed(1)}%`
    });
    
  } catch (error) {
    console.error('Bulk insert error:', error);
    return c.json({ error: 'Bulk insert failed' }, 500);
  }
});

// Enhanced Frontend Routes with Language Support
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KABridge - 한국-아랍 비즈니스 매칭 플랫폼</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Sans+Arabic:wght@300;400;500;700;900&display=swap" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'kabridge-blue': '#1e40af',
                  'kabridge-gold': '#f59e0b'
                },
                fontFamily: {
                  'sans': ['Inter', 'Noto Sans KR', 'Noto Sans Arabic', 'ui-sans-serif', 'system-ui'],
                  'korean': ['Noto Sans KR', 'Inter', 'sans-serif'],
                  'arabic': ['Noto Sans Arabic', 'Inter', 'sans-serif']
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50 min-h-screen font-sans">
        <!-- Navigation -->
        <nav class="kabridge-nav">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="/" class="kabridge-logo">
                            <img src="/static/kabridge-logo.svg" alt="KABridge" class="logo-icon">
                            <span class="logo-text">KABridge</span>
                        </a>
                        <div class="hidden md:ml-8 md:flex md:items-center md:space-x-6">
                            <a href="/" class="text-kabridge-blue font-medium px-3 py-2 text-sm">
                                <span class="lang-ko">홈</span>
                                <span class="lang-ar hidden">الرئيسية</span>
                            </a>
                            <a href="/search" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">기업 검색</span>
                                <span class="lang-ar hidden">البحث عن الشركات</span>
                            </a>
                            <a href="/ai-matching" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">AI 매칭</span>
                                <span class="lang-ar hidden">مطابقة AI</span>
                            </a>
                            <a href="/community" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">커뮤니티</span>
                                <span class="lang-ar hidden">المجتمع</span>
                            </a>
                            <a href="/requests" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">매칭 요청</span>
                                <span class="lang-ar hidden">طلبات المطابقة</span>
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Language Selector -->
                        <div class="language-selector">
                            <button id="languageBtn" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <span class="text-sm font-medium">🇰🇷 한국어</span>
                                <i class="fas fa-chevron-down text-xs"></i>
                            </button>
                            <div id="languageDropdown" class="language-dropdown">
                                <button class="language-option active" data-lang="ko">
                                    <span class="mr-2">🇰🇷</span>
                                    한국어
                                </button>
                                <button class="language-option" data-lang="ar">
                                    <span class="mr-2">🇸🇦</span>
                                    العربية
                                </button>
                            </div>
                        </div>
                        
                        <button class="kabridge-btn kabridge-btn-primary">
                            <span class="lang-ko">로그인</span>
                            <span class="lang-ar hidden">تسجيل الدخول</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- AI-Centered Main Section -->
        <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
            <!-- Background Animation -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-40 -right-40 w-80 h-80 bg-kabridge-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-kabridge-gold opacity-10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-kabridge-blue to-kabridge-gold opacity-5 rounded-full blur-3xl animate-spin-slow"></div>
            </div>
            
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <!-- Logo and Title -->
                <div class="mb-8">
                    <img src="/static/kabridge-logo.svg" alt="KABridge" class="w-20 h-20 mx-auto mb-4 animate-bounce-slow">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        <span class="lang-ko">KABridge AI</span>
                        <span class="lang-ar hidden">KABridge AI</span>
                    </h1>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        <span class="lang-ko">원하는 비즈니스 협력을 AI에게 물어보세요. 한국과 아랍 기업 간 최적의 매칭을 찾아드립니다.</span>
                        <span class="lang-ar hidden">اسأل الذكاء الاصطناعي عن التعاون التجاري الذي تريده. سنجد لك أفضل مطابقة بين الشركات الكورية والعربية.</span>
                    </p>
                </div>
                
                <!-- AI Input Section -->
                <div class="kabridge-card max-w-3xl mx-auto p-8 mb-8 bg-white/80 backdrop-blur-sm border border-white/50">
                    <div class="mb-6">
                        <h2 class="text-xl font-semibold text-gray-800 mb-2">
                            <i class="fas fa-brain text-kabridge-blue mr-2"></i>
                            <span class="lang-ko">AI 비즈니스 매칭</span>
                            <span class="lang-ar hidden">مطابقة الأعمال بالذكاء الاصطناعي</span>
                        </h2>
                        <p class="text-sm text-gray-600">
                            <span class="lang-ko">예: "사우디에서 K-뷰티 사업을 시작하고 싶은데 현지 파트너를 찾고 있습니다"</span>
                            <span class="lang-ar hidden">مثال: "أريد بدء أعمال K-beauty في السعودية وأبحث عن شريك محلي"</span>
                        </p>
                    </div>
                    
                    <form id="mainAIForm" class="space-y-4">
                        <div class="relative">
                            <textarea 
                                id="mainAIInput" 
                                rows="4" 
                                class="w-full px-4 py-4 pr-16 text-base border-2 border-gray-200 rounded-xl focus:border-kabridge-blue focus:ring-4 focus:ring-blue-100 resize-none transition-all duration-300"
                                placeholder=""
                                required></textarea>
                            <div class="absolute right-4 top-4">
                                <button type="submit" class="w-8 h-8 bg-kabridge-blue hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors">
                                    <i class="fas fa-paper-plane text-sm"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 justify-center">
                            <button type="button" class="ai-suggestion px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                                <span class="lang-ko">사우디 스마트팜 협력사 찾기</span>
                                <span class="lang-ar hidden">البحث عن شريك للزراعة الذكية في السعودية</span>
                            </button>
                            <button type="button" class="ai-suggestion px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                                <span class="lang-ko">UAE 핀테크 시장 진출</span>
                                <span class="lang-ar hidden">دخول سوق التكنولوجيا المالية في الإمارات</span>
                            </button>
                            <button type="button" class="ai-suggestion px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                                <span class="lang-ko">이집트 K-푸드 유통업체 찾기</span>
                                <span class="lang-ar hidden">البحث عن موزع K-Food في مصر</span>
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Quick Access Buttons -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <a href="/search" class="kabridge-card p-6 hover:shadow-xl transition-all duration-300 group">
                        <div class="w-12 h-12 bg-gradient-to-br from-kabridge-blue to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                            <i class="fas fa-search text-white text-xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">
                            <span class="lang-ko">기업 검색</span>
                            <span class="lang-ar hidden">البحث عن الشركات</span>
                        </h3>
                        <p class="text-sm text-gray-600">
                            <span class="lang-ko">600+ 기업 데이터베이스에서 검색</span>
                            <span class="lang-ar hidden">البحث في قاعدة بيانات 600+ شركة</span>
                        </p>
                    </a>
                    
                    <a href="/community" class="kabridge-card p-6 hover:shadow-xl transition-all duration-300 group">
                        <div class="w-12 h-12 bg-gradient-to-br from-kabridge-gold to-yellow-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                            <i class="fas fa-users text-white text-xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">
                            <span class="lang-ko">커뮤니티</span>
                            <span class="lang-ar hidden">المجتمع</span>
                        </h3>
                        <p class="text-sm text-gray-600">
                            <span class="lang-ko">비즈니스 경험과 기회 공유</span>
                            <span class="lang-ar hidden">مشاركة الخبرات والفرص التجارية</span>
                        </p>
                    </a>
                    
                    <a href="/requests" class="kabridge-card p-6 hover:shadow-xl transition-all duration-300 group">
                        <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                            <i class="fas fa-handshake text-white text-xl"></i>
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-2">
                            <span class="lang-ko">매칭 요청</span>
                            <span class="lang-ar hidden">طلبات المطابقة</span>
                        </h3>
                        <p class="text-sm text-gray-600">
                            <span class="lang-ko">맞춤형 파트너 찾기 요청</span>
                            <span class="lang-ar hidden">طلب العثور على شريك مخصص</span>
                        </p>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Recent Companies Section -->
        <div class="bg-white py-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-building text-kabridge-blue mr-2"></i>
                        <span class="lang-ko">최근 등록 기업</span>
                        <span class="lang-ar hidden">الشركات المسجلة حديثاً</span>
                    </h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">
                        <span class="lang-ko">한국과 아랍 국가의 우수 기업들을 만나보세요. AI 기반 매칭으로 최적의 비즈니스 파트너를 찾아드립니다.</span>
                        <span class="lang-ar hidden">تعرف على الشركات المتميزة من كوريا والدول العربية. نساعدك في العثور على أفضل شركاء الأعمال باستخدام تقنية الذكاء الاصطناعي.</span>
                    </p>
                </div>
                <div id="recent-companies" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Recent companies will appear here -->
                    <div class="col-span-full text-center py-12 text-gray-500">
                        <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                        <p class="lang-ko">기업 정보를 로딩중입니다...</p>
                        <p class="lang-ar hidden">جاري تحميل معلومات الشركات...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- AI Results Section -->
        <div id="aiResultsSection" class="hidden bg-white py-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
                    <i class="fas fa-stars text-kabridge-gold mr-2"></i>
                    <span class="lang-ko">AI 추천 결과</span>
                    <span class="lang-ar hidden">نتائج توصيات AI</span>
                </h2>
                <div id="aiResultsList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- AI results will appear here -->
                </div>
            </div>
        </div>

        <!-- Community Section -->
        <div class="bg-gray-50 py-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-comments text-kabridge-gold mr-2"></i>
                        <span class="lang-ko">커뮤니티 소식</span>
                        <span class="lang-ar hidden">أخبار المجتمع</span>
                    </h2>
                    <p class="text-gray-600 max-w-2xl mx-auto">
                        <span class="lang-ko">한국-아랍 비즈니스 커뮤니티의 최신 소식과 협력 기회를 확인하세요.</span>
                        <span class="lang-ar hidden">تابع أحدث الأخبار وفرص التعاون في مجتمع الأعمال الكوري-العربي.</span>
                    </p>
                </div>
                <div id="recent-posts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Recent community posts will appear here -->
                    <div class="col-span-full text-center py-12 text-gray-500">
                        <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                        <p class="lang-ko">커뮤니티 게시글을 로딩중입니다...</p>
                        <p class="lang-ar hidden">جاري تحميل منشورات المجتمع...</p>
                    </div>
                </div>
                <div class="text-center mt-8">
                    <a href="/community" class="kabridge-btn kabridge-btn-outline">
                        <span class="lang-ko">더 많은 게시글 보기</span>
                        <span class="lang-ar hidden">عرض المزيد من المشاركات</span>
                        <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>



        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <div class="flex justify-center items-center mb-4">
                        <img src="/static/kabridge-logo.svg" alt="KABridge" class="w-12 h-12 mr-3">
                        <span class="text-2xl font-bold">KABridge</span>
                    </div>
                    <p class="text-gray-400">
                        <span class="lang-ko">한국과 아랍 세계를 연결하는 비즈니스 플랫폼</span>
                        <span class="lang-ar hidden">منصة الأعمال التي تربط كوريا والعالم العربي</span>
                    </p>
                </div>
            </div>
        </footer>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
});

// Search page with enhanced design
app.get('/search', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>기업 검색 - KABridge</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Sans+Arabic:wght@300;400;500;700;900&display=swap" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'kabridge-blue': '#1e40af',
                  'kabridge-gold': '#f59e0b'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50 min-h-screen font-sans">
        <!-- Navigation -->
        <nav class="kabridge-nav">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="/" class="kabridge-logo">
                            <img src="/static/kabridge-logo.svg" alt="KABridge" class="logo-icon">
                            <span class="logo-text">KABridge</span>
                        </a>
                        <div class="hidden md:ml-8 md:flex md:items-center md:space-x-6">
                            <a href="/" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">홈</span>
                                <span class="lang-ar hidden">الرئيسية</span>
                            </a>
                            <a href="/search" class="text-kabridge-blue font-medium px-3 py-2 text-sm">
                                <span class="lang-ko">기업 검색</span>
                                <span class="lang-ar hidden">البحث عن الشركات</span>
                            </a>
                            <a href="/ai-matching" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">AI 매칭</span>
                                <span class="lang-ar hidden">مطابقة AI</span>
                            </a>
                            <a href="/community" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">커뮤니티</span>
                                <span class="lang-ar hidden">المجتمع</span>
                            </a>
                            <a href="/requests" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">
                                <span class="lang-ko">매칭 요청</span>
                                <span class="lang-ar hidden">طلبات المطابقة</span>
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Language Selector -->
                        <div class="language-selector">
                            <button id="languageBtn" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <span class="text-sm font-medium">🇰🇷 한국어</span>
                                <i class="fas fa-chevron-down text-xs"></i>
                            </button>
                            <div id="languageDropdown" class="language-dropdown">
                                <button class="language-option active" data-lang="ko">
                                    <span class="mr-2">🇰🇷</span>
                                    한국어
                                </button>
                                <button class="language-option" data-lang="ar">
                                    <span class="mr-2">🇸🇦</span>
                                    العربية
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-8">
                <span class="lang-ko">기업 검색</span>
                <span class="lang-ar hidden">البحث عن الشركات</span>
            </h1>
            
            <!-- Search and Filter Section -->
            <div class="kabridge-card p-6 mb-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Search Input -->
                    <div class="md:col-span-2">
                        <label class="form-label">
                            <span class="lang-ko">검색어</span>
                            <span class="lang-ar hidden">كلمة البحث</span>
                        </label>
                        <div class="relative">
                            <input type="text" id="searchInput" class="form-input" 
                                   placeholder="기업명, 업종, 협력분야 검색...">
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <i class="fas fa-search text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Country Filter -->
                    <div>
                        <label class="form-label">
                            <span class="lang-ko">국가</span>
                            <span class="lang-ar hidden">البلد</span>
                        </label>
                        <select id="countryFilter" class="form-input form-select">
                            <option value="">전체</option>
                            <option value="KR">🇰🇷 한국</option>
                            <option value="SA">🇸🇦 사우디아라비아</option>
                            <option value="AE">🇦🇪 UAE</option>
                            <option value="EG">🇪🇬 이집트</option>
                            <option value="JO">🇯🇴 요단</option>
                            <option value="LB">🇱🇧 레바논</option>
                            <option value="QA">🇶🇦 카타르</option>
                            <option value="BH">🇧🇭 바레인</option>
                            <option value="KW">🇰🇼 쿠웨이트</option>
                            <option value="OM">🇴🇲 오만</option>
                        </select>
                    </div>
                    
                    <!-- Industry Filter -->
                    <div>
                        <label class="form-label">
                            <span class="lang-ko">산업</span>
                            <span class="lang-ar hidden">الصناعة</span>
                        </label>
                        <select id="industryFilter" class="form-input form-select">
                            <option value="">전체</option>
                            <option value="technology">기술/IT</option>
                            <option value="manufacturing">제조업</option>
                            <option value="energy">에너지</option>
                            <option value="healthcare">헬스케어</option>
                            <option value="finance">금융</option>
                            <option value="construction">건설</option>
                            <option value="food">식품</option>
                            <option value="logistics">물류</option>
                            <option value="retail">소매</option>
                            <option value="education">교육</option>
                        </select>
                    </div>
                </div>
                
                <div class="mt-6 flex justify-between items-center">
                    <button id="searchBtn" class="kabridge-btn kabridge-btn-primary">
                        <i class="fas fa-search mr-2"></i>
                        <span class="lang-ko">검색</span>
                        <span class="lang-ar hidden">بحث</span>
                    </button>
                    <div id="searchStats" class="text-sm text-gray-600">
                        <!-- Search stats will appear here -->
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div id="searchResults" class="space-y-6">
                <!-- Search results will appear here -->
            </div>
            
            <!-- Loading State -->
            <div id="loadingState" class="hidden text-center py-12">
                <div class="loading-spinner"></div>
                <p class="text-gray-600 mt-4">
                    <span class="lang-ko">검색 중...</span>
                    <span class="lang-ar hidden">جاري البحث...</span>
                </p>
            </div>
            
            <!-- No Results State -->
            <div id="noResultsState" class="hidden text-center py-12">
                <i class="fas fa-search text-gray-400 text-3xl mb-4"></i>
                <p class="text-gray-600">
                    <span class="lang-ko">검색 결과가 없습니다. 다른 조건으로 검색해보세요.</span>
                    <span class="lang-ar hidden">لا توجد نتائج بحث. جرب شروط بحث أخرى.</span>
                </p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
});

// Community page
app.get('/community', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>커뮤니티 - KABridge</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Sans+Arabic:wght@300;400;500;700;900&display=swap" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'kabridge-blue': '#1e40af',
                  'kabridge-gold': '#f59e0b'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50 min-h-screen font-sans">
        <!-- Navigation -->
        <nav class="kabridge-nav">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="/" class="kabridge-logo">
                            <img src="/static/kabridge-logo.svg" alt="KABridge" class="logo-icon">
                            <span class="logo-text">KABridge</span>
                        </a>
                        <div class="hidden md:ml-8 md:flex md:items-center md:space-x-6">
                            <a href="/" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">홈</a>
                            <a href="/search" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">기업 검색</a>
                            <a href="/ai-matching" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">AI 매칭</a>
                            <a href="/community" class="text-kabridge-blue font-medium px-3 py-2 text-sm">커뮤니티</a>
                            <a href="/requests" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">매칭 요청</a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Language Selector -->
                        <div class="language-selector">
                            <button id="languageBtn" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <span class="text-sm font-medium">🇰🇷 한국어</span>
                                <i class="fas fa-chevron-down text-xs"></i>
                            </button>
                            <div id="languageDropdown" class="language-dropdown">
                                <button class="language-option active" data-lang="ko">
                                    <span class="mr-2">🇰🇷</span>
                                    한국어
                                </button>
                                <button class="language-option" data-lang="ar">
                                    <span class="mr-2">🇸🇦</span>
                                    العربية
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-users text-kabridge-blue mr-3"></i>커뮤니티
                </h1>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    한국-아랍 비즈니스 커뮤니티에서 경험을 공유하고 새로운 기회를 발견하세요
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center mb-8">
                <div class="kabridge-card p-6">
                    <div class="flex flex-wrap gap-3">
                        <button class="kabridge-btn kabridge-btn-primary category-btn active" data-category="">전체</button>
                        <button class="kabridge-btn kabridge-btn-outline category-btn" data-category="partnership">파트너십</button>
                        <button class="kabridge-btn kabridge-btn-outline category-btn" data-category="investment">투자</button>
                        <button class="kabridge-btn kabridge-btn-outline category-btn" data-category="technology">기술</button>
                        <button class="kabridge-btn kabridge-btn-outline category-btn" data-category="trade">무역</button>
                        <button class="kabridge-btn kabridge-btn-outline category-btn" data-category="general">일반</button>
                    </div>
                </div>
                <button id="newPostBtn" class="kabridge-btn kabridge-btn-primary flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>새 글 작성</span>
                </button>
            </div>

            <!-- New Post Form Modal -->
            <div id="newPostModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-bold text-gray-900">새 글 작성</h2>
                            <button id="closePostModal" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <form id="newPostForm" class="p-6">
                        <div class="space-y-6">
                            <!-- Title Fields -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">제목 (한국어)</label>
                                <input type="text" id="postTitle" name="title" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                       placeholder="게시글 제목을 입력하세요">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
                                <input type="text" id="postTitleEn" name="title_en"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                       placeholder="English title (optional)">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">العنوان (عربي)</label>
                                <input type="text" id="postTitleAr" name="title_ar"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue text-right"
                                       placeholder="العنوان باللغة العربية (اختياري)">
                            </div>
                            
                            <!-- Content Fields -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">내용 (한국어)</label>
                                <textarea id="postContent" name="content" required rows="6"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                          placeholder="게시글 내용을 입력하세요"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Content (English)</label>
                                <textarea id="postContentEn" name="content_en" rows="4"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                          placeholder="English content (optional)"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">المحتوى (عربي)</label>
                                <textarea id="postContentAr" name="content_ar" rows="4"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue text-right"
                                          placeholder="المحتوى باللغة العربية (اختياري)"></textarea>
                            </div>
                            
                            <!-- Author Information -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">작성자명</label>
                                    <input type="text" id="authorName" name="author_name" required
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                           placeholder="이름을 입력하세요">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">회사명</label>
                                    <input type="text" id="authorCompany" name="author_company"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                           placeholder="회사명 (선택사항)">
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">국가</label>
                                    <select id="authorCountry" name="author_country" required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue">
                                        <option value="">국가 선택</option>
                                        <option value="KR">🇰🇷 대한민국</option>
                                        <option value="SA">🇸🇦 사우디아라비아</option>
                                        <option value="AE">🇦🇪 아랍에미리트</option>
                                        <option value="KW">🇰🇼 쿠웨이트</option>
                                        <option value="QA">🇶🇦 카타르</option>
                                        <option value="BH">🇧🇭 바레인</option>
                                        <option value="OM">🇴🇲 오만</option>
                                        <option value="JO">🇯🇴 요단</option>
                                        <option value="LB">🇱🇧 레바논</option>
                                        <option value="EG">🇪🇬 이집트</option>
                                        <option value="MA">🇲🇦 모로코</option>
                                        <option value="TN">🇹🇳 튀니지</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                                    <select id="postCategory" name="category" required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue">
                                        <option value="general">일반</option>
                                        <option value="partnership">파트너십</option>
                                        <option value="investment">투자</option>
                                        <option value="technology">기술</option>
                                        <option value="trade">무역</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                            <button type="button" id="cancelPost" class="kabridge-btn kabridge-btn-outline">
                                취소
                            </button>
                            <button type="submit" class="kabridge-btn kabridge-btn-primary">
                                <i class="fas fa-paper-plane mr-2"></i>
                                게시글 작성
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Posts Section -->
            <div id="communityPosts" class="space-y-6">
                <!-- Posts will be loaded here -->
            </div>
            
            <!-- Loading State -->
            <div id="postsLoading" class="hidden text-center py-12">
                <div class="loading-spinner"></div>
                <p class="text-gray-600 mt-4">게시글을 불러오는 중...</p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
});

// Matching Requests page
app.get('/requests', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>매칭 요청 - KABridge</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Sans+Arabic:wght@300;400;500;700;900&display=swap" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'kabridge-blue': '#1e40af',
                  'kabridge-gold': '#f59e0b'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50 min-h-screen font-sans">
        <!-- Navigation -->
        <nav class="kabridge-nav">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="/" class="kabridge-logo">
                            <img src="/static/kabridge-logo.svg" alt="KABridge" class="logo-icon">
                            <span class="logo-text">KABridge</span>
                        </a>
                        <div class="hidden md:ml-8 md:flex md:items-center md:space-x-6">
                            <a href="/" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">홈</a>
                            <a href="/search" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">기업 검색</a>
                            <a href="/ai-matching" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">AI 매칭</a>
                            <a href="/community" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">커뮤니티</a>
                            <a href="/requests" class="text-kabridge-blue font-medium px-3 py-2 text-sm">매칭 요청</a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Language Selector -->
                        <div class="language-selector">
                            <button id="languageBtn" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <span class="text-sm font-medium">🇰🇷 한국어</span>
                                <i class="fas fa-chevron-down text-xs"></i>
                            </button>
                            <div id="languageDropdown" class="language-dropdown">
                                <button class="language-option active" data-lang="ko">
                                    <span class="mr-2">🇰🇷</span>
                                    한국어
                                </button>
                                <button class="language-option" data-lang="ar">
                                    <span class="mr-2">🇸🇦</span>
                                    العربية
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-handshake text-kabridge-gold mr-3"></i>매칭 요청
                </h1>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    비즈니스 파트너를 찾고 있나요? 매칭 요청을 등록하거나 다른 기업의 요청을 확인해보세요
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Create Request Form -->
                <div class="kabridge-card p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">
                        <i class="fas fa-plus-circle text-kabridge-blue mr-2"></i>새 매칭 요청
                    </h2>
                    
                    <form id="requestForm" class="space-y-6">
                        <div class="form-group">
                            <label class="form-label">담당자 이름 *</label>
                            <input type="text" id="requesterName" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">회사명</label>
                            <input type="text" id="requesterCompany" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">국가 *</label>
                            <select id="requesterCountry" class="form-input form-select" required>
                                <option value="">선택해주세요</option>
                                <option value="KR">🇰🇷 한국</option>
                                <option value="SA">🇸🇦 사우디아라비아</option>
                                <option value="AE">🇦🇪 UAE</option>
                                <option value="EG">🇪🇬 이집트</option>
                                <option value="JO">🇯🇴 요단</option>
                                <option value="LB">🇱🇧 레바논</option>
                                <option value="QA">🇶🇦 카타르</option>
                                <option value="BH">🇧🇭 바레인</option>
                                <option value="KW">🇰🇼 쿠웨이트</option>
                                <option value="OM">🇴🇲 오만</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">협력 목적 *</label>
                            <textarea id="cooperationPurpose" class="form-input form-textarea" rows="4" 
                                      placeholder="예: UAE에서 K-뷰티 브랜드 론칭을 위한 현지 유통업체와 파트너십을 원합니다" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">연락처 이메일</label>
                            <input type="email" id="contactEmail" class="form-input">
                        </div>
                        
                        <button type="submit" class="kabridge-btn kabridge-btn-primary w-full">
                            <i class="fas fa-paper-plane mr-2"></i>매칭 요청 등록
                        </button>
                    </form>
                </div>
                
                <!-- Recent Requests -->
                <div class="kabridge-card p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">
                        <i class="fas fa-clock text-kabridge-gold mr-2"></i>최근 매칭 요청
                    </h2>
                    
                    <div id="matchingRequestsList" class="space-y-4">
                        <!-- Requests will be loaded here -->
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
});

// AI Matching page (unchanged but enhanced design)
app.get('/ai-matching', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI 매칭 - KABridge</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Sans+Arabic:wght@300;400;500;700;900&display=swap" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'kabridge-blue': '#1e40af',
                  'kabridge-gold': '#f59e0b'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50 min-h-screen font-sans">
        <!-- Navigation -->
        <nav class="kabridge-nav">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="/" class="kabridge-logo">
                            <img src="/static/kabridge-logo.svg" alt="KABridge" class="logo-icon">
                            <span class="logo-text">KABridge</span>
                        </a>
                        <div class="hidden md:ml-8 md:flex md:items-center md:space-x-6">
                            <a href="/" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">홈</a>
                            <a href="/search" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">기업 검색</a>
                            <a href="/ai-matching" class="text-kabridge-blue font-medium px-3 py-2 text-sm">AI 매칭</a>
                            <a href="/community" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">커뮤니티</a>
                            <a href="/requests" class="text-gray-500 hover:text-kabridge-blue font-medium px-3 py-2 text-sm transition-colors">매칭 요청</a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Language Selector -->
                        <div class="language-selector">
                            <button id="languageBtn" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <span class="text-sm font-medium">🇰🇷 한국어</span>
                                <i class="fas fa-chevron-down text-xs"></i>
                            </button>
                            <div id="languageDropdown" class="language-dropdown">
                                <button class="language-option active" data-lang="ko">
                                    <span class="mr-2">🇰🇷</span>
                                    한국어
                                </button>
                                <button class="language-option" data-lang="ar">
                                    <span class="mr-2">🇸🇦</span>
                                    العربية
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-robot text-kabridge-blue mr-3"></i>AI 기업 매칭
                </h1>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    원하시는 협력 분야를 입력하시면 AI가 최적의 파트너 기업을 추천해드립니다
                </p>
            </div>
            
            <!-- AI Matching Form -->
            <div class="kabridge-card p-8 mb-8">
                <form id="aiMatchingForm">
                    <div class="form-group">
                        <label class="form-label">
                            협력 희망 분야를 입력해주세요 *
                        </label>
                        <textarea id="cooperationPurpose" rows="4" 
                                  placeholder="예: 사우디 스마트팜 분야에서 한국 기업과 협력을 희망합니다" 
                                  class="form-input form-textarea"
                                  required></textarea>
                        <p class="mt-2 text-sm text-gray-500">구체적이고 명확하게 작성할수록 더 정확한 매칭이 가능합니다.</p>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">소속 국가</label>
                        <select id="userCountry" class="form-input form-select">
                            <option value="KR">🇰🇷 한국</option>
                            <option value="SA">🇸🇦 사우디아라비아</option>
                            <option value="AE">🇦🇪 UAE</option>
                            <option value="EG">🇪🇬 이집트</option>
                            <option value="JO">🇯🇴 요단</option>
                            <option value="LB">🇱🇧 레바논</option>
                            <option value="QA">🇶🇦 카타르</option>
                            <option value="BH">🇧🇭 바레인</option>
                            <option value="KW">🇰🇼 쿠웨이트</option>
                            <option value="OM">🇴🇲 오만</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="kabridge-btn kabridge-btn-primary w-full">
                        <i class="fas fa-search mr-2"></i>AI 매칭 시작
                    </button>
                </form>
            </div>

            <!-- AI Matching Results -->
            <div id="matchingResults" class="hidden">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                    <i class="fas fa-stars text-kabridge-gold mr-2"></i>추천 기업
                </h2>
                <div id="matchingResultsList" class="space-y-6">
                    <!-- Results will appear here -->
                </div>
            </div>
            
            <!-- Loading State -->
            <div id="matchingLoading" class="hidden text-center py-12">
                <div class="loading-spinner"></div>
                <p class="text-gray-600 mt-4">AI가 최적의 파트너를 찾고 있습니다...</p>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
});

// Data insertion API for initial setup
app.post('/api/init-data', async (c) => {
  try {
    const { env } = c;
    
    // Generate 600 companies (300 Korean + 300 Arab)
    const koreanCompanies = [];
    const arabCompanies = [];
    
    // Korean companies data
    const koreanIndustries = ['technology', 'manufacturing', 'healthcare', 'food', 'energy'];
    const koreanCities = ['서울', '부산', '대구', '인천', '광주', '대전', '울산'];
    
    for (let i = 0; i < 300; i++) {
      const industry = koreanIndustries[i % koreanIndustries.length];
      const city = koreanCities[i % koreanCities.length];
      
      koreanCompanies.push({
        name: `한국${industry === 'technology' ? '테크' : industry === 'manufacturing' ? '제조' : industry === 'healthcare' ? '헬스케어' : industry === 'food' ? '푸드' : '에너지'}${String(i + 1).padStart(3, '0')}`,
        name_en: `Korea${industry.charAt(0).toUpperCase() + industry.slice(1)}${String(i + 1).padStart(3, '0')}`,
        name_ar: `كوريا ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'healthcare' ? 'الرعاية الصحية' : industry === 'food' ? 'الغذاء' : 'الطاقة'} ${String(i + 1).padStart(3, '0')}`,
        location: city,
        location_en: city,
        location_ar: city,
        industry: industry,
        description: `${industry === 'technology' ? '혁신적인 기술 솔루션' : industry === 'manufacturing' ? '고품질 제조업' : industry === 'healthcare' ? '첨단 헬스케어 서비스' : industry === 'food' ? 'K-푸드 전문' : '신재생 에너지'}을 제공하는 ${city} 기반의 선도 기업입니다.`,
        description_en: `Leading ${industry} company based in ${city}, providing innovative solutions and services.`,
        description_ar: `شركة رائدة في ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'healthcare' ? 'الرعاية الصحية' : industry === 'food' ? 'الغذاء' : 'الطاقة'} مقرها في ${city}، تقدم حلول وخدمات مبتكرة.`,
        cooperation_needs: `${industry === 'technology' ? '중동 IT 시장 진출 파트너' : industry === 'manufacturing' ? '아랍 지역 제조 협력사' : industry === 'healthcare' ? '중동 헬스케어 파트너' : industry === 'food' ? 'K-푸드 유통 파트너' : '신재생 에너지 프로젝트 협력'} 모집`,
        cooperation_needs_en: `Seeking ${industry} partnership in Middle East market`,
        cooperation_needs_ar: `البحث عن شراكة في ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'healthcare' ? 'الرعاية الصحية' : industry === 'food' ? 'الغذاء' : 'الطاقة'} في السوق العربية`,
        country: 'KR',
        employee_count: String(Math.floor(Math.random() * 2000) + 50),
        status: 'active'
      });
    }
    
    // Arab companies data
    const arabCountries = ['SA', 'AE', 'EG', 'JO', 'QA', 'KW', 'BH', 'OM'];
    const arabIndustries = ['technology', 'manufacturing', 'energy', 'finance', 'construction'];
    const arabCities = {
      'SA': ['الرياض', 'جدة', 'الدمام'],
      'AE': ['دبي', 'أبوظبي', 'الشارقة'],
      'EG': ['القاهرة', 'الإسكندرية', 'الجيزة'],
      'JO': ['عمان', 'إربد'],
      'QA': ['الدوحة'],
      'KW': ['الكويت'],
      'BH': ['المنامة'],
      'OM': ['مسقط']
    };
    
    for (let i = 0; i < 300; i++) {
      const country = arabCountries[i % arabCountries.length];
      const industry = arabIndustries[i % arabIndustries.length];
      const cities = arabCities[country];
      const city = cities[i % cities.length];
      
      arabCompanies.push({
        name: `${city} ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'energy' ? 'الطاقة' : industry === 'finance' ? 'المالية' : 'البناء'} ${String(i + 1).padStart(3, '0')}`,
        name_en: `${city.replace(/[^\w]/g, '')} ${industry.charAt(0).toUpperCase() + industry.slice(1)} ${String(i + 1).padStart(3, '0')}`,
        name_ar: `${city} ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'energy' ? 'الطاقة' : industry === 'finance' ? 'المالية' : 'البناء'} ${String(i + 1).padStart(3, '0')}`,
        location: city,
        location_en: city,
        location_ar: city,
        industry: industry,
        description: `شركة رائدة في ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'energy' ? 'الطاقة' : industry === 'finance' ? 'المالية' : 'البناء'} مقرها في ${city}`,
        description_en: `Leading ${industry} company based in ${city}, specialized in innovative solutions`,
        description_ar: `شركة رائدة في ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'energy' ? 'الطاقة' : industry === 'finance' ? 'المالية' : 'البناء'} مقرها في ${city}، متخصصة في الحلول المبتكرة`,
        cooperation_needs: `한국 기업과의 ${industry === 'technology' ? '기술' : industry === 'manufacturing' ? '제조' : industry === 'energy' ? '에너지' : industry === 'finance' ? '금융' : '건설'} 협력`,
        cooperation_needs_en: `Seeking Korean partnership in ${industry} sector`,
        cooperation_needs_ar: `البحث عن شراكة كورية في قطاع ${industry === 'technology' ? 'التكنولوجيا' : industry === 'manufacturing' ? 'التصنيع' : industry === 'energy' ? 'الطاقة' : industry === 'finance' ? 'المالية' : 'البناء'}`,
        country: country,
        employee_count: String(Math.floor(Math.random() * 1500) + 30),
        status: 'active'
      });
    }
    
    // Insert Korean companies
    for (const company of koreanCompanies) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO companies (
          name, name_en, name_ar, location, location_en, location_ar,
          industry, description, description_en, description_ar,
          cooperation_needs, cooperation_needs_en, cooperation_needs_ar,
          country, employee_count, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        company.name, company.name_en, company.name_ar,
        company.location, company.location_en, company.location_ar,
        company.industry, company.description, company.description_en, company.description_ar,
        company.cooperation_needs, company.cooperation_needs_en, company.cooperation_needs_ar,
        company.country, company.employee_count, company.status
      ).run();
    }
    
    // Insert Arab companies
    for (const company of arabCompanies) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO companies (
          name, name_en, name_ar, location, location_en, location_ar,
          industry, description, description_en, description_ar,
          cooperation_needs, cooperation_needs_en, cooperation_needs_ar,
          country, employee_count, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        company.name, company.name_en, company.name_ar,
        company.location, company.location_en, company.location_ar,
        company.industry, company.description, company.description_en, company.description_ar,
        company.cooperation_needs, company.cooperation_needs_en, company.cooperation_needs_ar,
        company.country, company.employee_count, company.status
      ).run();
    }
    
    // Insert sample posts
    const samplePosts = [
      {
        title: 'UAE 핀테크 시장 진출 협력사 모집',
        title_en: 'Seeking Partners for UAE Fintech Market Entry',
        title_ar: 'البحث عن شركاء لدخول سوق التكنولوجيا المالية في الإمارات',
        content: 'K-핀테크 기업으로서 UAE 시장 진출을 위한 현지 파트너를 찾고 있습니다. 디지털 결제, 블록체인, 암호화폐 분야의 협력을 희망합니다.',
        content_en: 'Korean fintech company seeking local partners for UAE market entry. Looking for cooperation in digital payments, blockchain, and cryptocurrency sectors.',
        content_ar: 'شركة كورية للتكنولوجيا المالية تبحث عن شركاء محليين لدخول السوق الإماراتية. نسعى للتعاون في المدفوعات الرقمية والبلوك تشين والعملات المشفرة.',
        author_name: '김테크',
        author_company: '한국핀테크',
        author_country: 'KR',
        category: 'partnership',
        status: 'active'
      },
      {
        title: 'سوق K-Beauty في السعودية',
        title_en: 'K-Beauty Market Opportunities in Saudi Arabia',
        title_ar: 'فرص السوق لمنتجات الجمال الكورية في السعودية',
        content: 'نحن شركة توزيع في الرياض نبحث عن شركاء كوريين في مجال مستحضرات التجميل لتوزيع منتجات K-Beauty في السعودية.',
        content_en: 'We are a distribution company in Riyadh seeking Korean partners in cosmetics to distribute K-Beauty products in Saudi Arabia.',
        content_ar: 'نحن شركة توزيع في الرياض نبحث عن شركاء كوريين في مجال مستحضرات التجميل لتوزيع منتجات K-Beauty في السعودية.',
        author_name: 'أحمد التجاري',
        author_company: 'الرياض للتوزيع',
        author_country: 'SA',
        category: 'trade',
        status: 'featured'
      },
      {
        title: '스마트팜 기술 중동 진출',
        title_en: 'Smart Farm Technology Expansion to Middle East',
        title_ar: 'توسع تكنولوجيا المزارع الذكية إلى الشرق الأوسط',
        content: '한국의 스마트팜 기술을 중동 지역에 도입하고자 합니다. 특히 사우디 비전 2030 프로젝트와 연계한 농업 혁신 사업에 관심이 있습니다.',
        content_en: 'Looking to introduce Korean smart farm technology to the Middle East region. Particularly interested in agricultural innovation projects linked to Saudi Vision 2030.',
        content_ar: 'نسعى لتقديم تكنولوجيا المزارع الذكية الكورية إلى منطقة الشرق الأوسط. مهتمون بشكل خاص بمشاريع الابتكار الزراعي المرتبطة برؤية السعودية 2030.',
        author_name: '박농업',
        author_company: '스마트팜코리아',
        author_country: 'KR',
        category: 'technology',
        status: 'active'
      },
      {
        title: 'مشروع الطاقة المتجددة المشترك',
        title_en: 'Joint Renewable Energy Project',
        title_ar: 'مشروع الطاقة المتجددة المشترك',
        content: 'شركة إماراتية متخصصة في الطاقة الشمسية تبحث عن شراكة مع شركات كورية لمشاريع الطاقة المتجددة الكبرى في منطقة الخليج.',
        content_en: 'UAE solar energy company seeking partnership with Korean companies for major renewable energy projects in the Gulf region.',
        content_ar: 'شركة إماراتية متخصصة في الطاقة الشمسية تبحث عن شراكة مع شركات كورية لمشاريع الطاقة المتجددة الكبرى في منطقة الخليج.',
        author_name: 'محمد الطاقة',
        author_company: 'الإمارات للطاقة الشمسية',
        author_country: 'AE',
        category: 'investment',
        status: 'active'
      },
      {
        title: 'K-드라마 컨텐츠 중동 배급',
        title_en: 'K-Drama Content Distribution in Middle East',
        title_ar: 'توزيع محتوى الدراما الكورية في الشرق الأوسط',
        content: 'OTT 플랫폼 운영 경험이 있는 중동 파트너를 찾습니다. K-드라마, K-팝 컨텐츠의 아랍어 더빙 및 현지화 사업을 함께 추진하고자 합니다.',
        content_en: 'Seeking Middle Eastern partners with OTT platform experience. Looking to collaborate on Arabic dubbing and localization of K-drama and K-pop content.',
        content_ar: 'نبحث عن شركاء في الشرق الأوسط لديهم خبرة في منصات البث. نسعى للتعاون في الدبلجة العربية وتوطين محتوى الدراما والموسيقى الكورية.',
        author_name: '이콘텐츠',
        author_company: '코리아 엔터테인먼트',
        author_country: 'KR',
        category: 'general',
        status: 'active'
      }
    ];
    
    for (const post of samplePosts) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO posts (
          title, title_en, title_ar, content, content_en, content_ar,
          author_name, author_company, author_country, category, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        post.title, post.title_en, post.title_ar,
        post.content, post.content_en, post.content_ar,
        post.author_name, post.author_company, post.author_country,
        post.category, post.status
      ).run();
    }
    
    return c.json({
      success: true,
      message: '600개 기업 데이터와 커뮤니티 글이 성공적으로 생성되었습니다!',
      companies_inserted: 600,
      posts_inserted: samplePosts.length
    });
    
  } catch (error) {
    console.error('Data insertion error:', error);
    return c.json({ error: 'Failed to insert data' }, 500);
  }
});

export default app