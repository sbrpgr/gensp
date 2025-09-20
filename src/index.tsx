import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Use JSX renderer
app.use(renderer)

// API Routes

// Get all companies with filtering
app.get('/api/companies', async (c) => {
  const { env } = c
  const { country, industry, business_type, search } = c.req.query()
  
  let query = `
    SELECT c.*, u.email 
    FROM companies c 
    LEFT JOIN users u ON c.user_id = u.id 
    WHERE c.status = 'active'
  `
  const params: any[] = []
  
  if (country) {
    query += ' AND c.country = ?'
    params.push(country)
  }
  
  if (industry) {
    query += ' AND c.industry = ?'
    params.push(industry)
  }
  
  if (business_type) {
    query += ' AND c.business_type = ?'
    params.push(business_type)
  }
  
  if (search) {
    query += ' AND (c.company_name LIKE ? OR c.company_name_en LIKE ? OR c.description LIKE ?)'
    const searchTerm = `%${search}%`
    params.push(searchTerm, searchTerm, searchTerm)
  }
  
  query += ' ORDER BY c.created_at DESC'
  
  try {
    const result = await env.DB.prepare(query).bind(...params).all()
    return c.json({ companies: result.results || [] })
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ error: 'Failed to fetch companies' }, 500)
  }
})

// Get company by ID
app.get('/api/companies/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  
  try {
    const result = await env.DB.prepare(`
      SELECT c.*, u.email 
      FROM companies c 
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.id = ? AND c.status = 'active'
    `).bind(id).first()
    
    if (!result) {
      return c.json({ error: 'Company not found' }, 404)
    }
    
    return c.json({ company: result })
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ error: 'Failed to fetch company' }, 500)
  }
})

// Create cooperation request
app.post('/api/cooperation-requests', async (c) => {
  const { env } = c
  const { sender_id, receiver_id, cooperation_type, subject, message } = await c.req.json()
  
  try {
    const result = await env.DB.prepare(`
      INSERT INTO cooperation_requests (sender_id, receiver_id, cooperation_type, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `).bind(sender_id, receiver_id, cooperation_type, subject, message).run()
    
    return c.json({ 
      id: result.meta.last_row_id,
      message: 'Cooperation request sent successfully'
    })
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ error: 'Failed to send cooperation request' }, 500)
  }
})

// Get cooperation requests for a company
app.get('/api/cooperation-requests/:company_id', async (c) => {
  const { env } = c
  const company_id = c.req.param('company_id')
  const type = c.req.query('type') || 'received' // 'sent' or 'received'
  
  const column = type === 'sent' ? 'sender_id' : 'receiver_id'
  const otherColumn = type === 'sent' ? 'receiver_id' : 'sender_id'
  
  try {
    const result = await env.DB.prepare(`
      SELECT cr.*, 
             c.company_name as other_company_name,
             c.company_name_en as other_company_name_en,
             c.country as other_country,
             c.industry as other_industry
      FROM cooperation_requests cr
      LEFT JOIN companies c ON c.id = cr.${otherColumn}
      WHERE cr.${column} = ?
      ORDER BY cr.created_at DESC
    `).bind(company_id).all()
    
    return c.json({ requests: result.results || [] })
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ error: 'Failed to fetch cooperation requests' }, 500)
  }
})

// Update cooperation request status
app.put('/api/cooperation-requests/:id', async (c) => {
  const { env } = c
  const id = c.req.param('id')
  const { status } = await c.req.json()
  
  try {
    await env.DB.prepare(`
      UPDATE cooperation_requests 
      SET status = ?, responded_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, id).run()
    
    return c.json({ message: 'Request status updated successfully' })
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ error: 'Failed to update request status' }, 500)
  }
})

// Register new company
app.post('/api/companies', async (c) => {
  const { env } = c
  const formData = await c.req.json()
  
  try {
    // Create user first (simplified - in real app would have proper auth)
    const userResult = await env.DB.prepare(`
      INSERT INTO users (email, password_hash, company_name, country)
      VALUES (?, ?, ?, ?)
    `).bind(
      formData.email || 'temp@example.com', // Temporary email
      'temp_password_hash', // Temporary password hash
      formData.company_name,
      formData.country
    ).run()
    
    const userId = userResult.meta.last_row_id
    
    // Parse array fields
    const main_products = formData.main_products ? 
      JSON.stringify(formData.main_products.split(',').map(item => item.trim()).filter(item => item)) : 
      '[]'
    
    const technologies = formData.technologies ? 
      JSON.stringify(formData.technologies.split(',').map(item => item.trim()).filter(item => item)) : 
      '[]'
      
    const certifications = formData.certifications ? 
      JSON.stringify(formData.certifications.split(',').map(item => item.trim()).filter(item => item)) : 
      '[]'
      
    const cooperation_types = formData.cooperation_types || '[]'
    
    const cooperation_regions = formData.cooperation_regions ? 
      JSON.stringify(formData.cooperation_regions.split(',').map(item => item.trim()).filter(item => item)) : 
      '[]'
    
    // Create company profile
    const companyResult = await env.DB.prepare(`
      INSERT INTO companies (
        user_id, company_name, company_name_en, business_type, industry, 
        company_size, founded_year, country, city, address, website, phone,
        description, main_products, technologies, certifications, 
        cooperation_types, cooperation_regions, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).bind(
      userId,
      formData.company_name,
      formData.company_name_en || null,
      formData.business_type,
      formData.industry,
      formData.company_size,
      formData.founded_year ? parseInt(formData.founded_year) : null,
      formData.country,
      formData.city || null,
      formData.address || null,
      formData.website || null,
      formData.phone || null,
      formData.description,
      main_products,
      technologies,
      certifications,
      cooperation_types,
      cooperation_regions
    ).run()
    
    return c.json({ 
      id: companyResult.meta.last_row_id,
      message: 'Company registered successfully' 
    })
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ error: 'Failed to register company' }, 500)
  }
})

// Main pages

// Home page - Company search and discovery
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">KABridge</h1>
              <span className="ml-2 text-sm text-gray-500">한국-아랍 기업 매칭 플랫폼</span>
            </div>
            <div className="flex space-x-4">
              <a href="/search" className="text-gray-700 hover:text-blue-600">기업 탐색</a>
              <a href="/register" className="text-gray-700 hover:text-blue-600">기업 등록</a>
              <a href="/requests" className="text-gray-700 hover:text-blue-600">협력 요청</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">한국과 아랍 기업을 연결하는 글로벌 비즈니스 플랫폼</h2>
            <p className="text-xl mb-8">직관적인 매칭 시스템으로 새로운 비즈니스 파트너를 찾아보세요</p>
            <div className="flex justify-center space-x-4">
              <a href="/search" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                기업 탐색하기
              </a>
              <a href="/register" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                기업 등록하기
              </a>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">왜 KABridge를 선택해야 할까요?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-search text-blue-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">직관적인 탐색</h4>
                <p className="text-gray-600">채용 플랫폼처럼 쉽고 간편한 기업 검색과 필터링</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-handshake text-green-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">신뢰할 수 있는 매칭</h4>
                <p className="text-gray-600">검증된 기업 프로필과 안전한 협력 요청 시스템</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-globe text-purple-600"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2">글로벌 네트워크</h4>
                <p className="text-gray-600">한국과 아랍 지역의 다양한 산업 파트너 연결</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Companies */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">최근 등록 기업</h3>
              <a href="/search" className="text-blue-600 hover:text-blue-800">전체 보기 →</a>
            </div>
            <div id="recent-companies" className="grid md:grid-cols-3 gap-6">
              {/* Companies will be loaded via JavaScript */}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">KABridge</h3>
          <p className="text-gray-300 mb-4">한국과 아랍 지역의 비즈니스 연결을 위한 혁신적인 플랫폼</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white">서비스 소개</a>
            <a href="#" className="text-gray-300 hover:text-white">이용약관</a>
            <a href="#" className="text-gray-300 hover:text-white">개인정보처리방침</a>
            <a href="#" className="text-gray-300 hover:text-white">고객지원</a>
          </div>
          <p className="text-gray-400 text-sm mt-4">© 2025 KABridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
})

// Company registration page
app.get('/register', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-600">KABridge</a>
            </div>
            <div className="flex space-x-4">
              <a href="/search" className="text-gray-700 hover:text-blue-600">기업 탐색</a>
              <a href="/register" className="text-blue-600 font-semibold">기업 등록</a>
              <a href="/requests" className="text-gray-700 hover:text-blue-600">협력 요청</a>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">기업 프로필 등록</h1>
            <p className="text-gray-600">KABridge 플랫폼에서 비즈니스 파트너를 찾기 위해 기업 정보를 등록해주세요</p>
          </div>
          
          <form id="company-registration-form" className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기업명 (한국어) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    className="form-input"
                    placeholder="예: 삼성전자"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기업명 (영어)
                  </label>
                  <input
                    type="text"
                    name="company_name_en"
                    className="form-input"
                    placeholder="예: Samsung Electronics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    국가 <span className="text-red-500">*</span>
                  </label>
                  <select name="country" required className="form-select">
                    <option value="">국가를 선택하세요</option>
                    <option value="korea">한국</option>
                    <option value="saudi_arabia">사우디아라비아</option>
                    <option value="uae">UAE</option>
                    <option value="qatar">카타르</option>
                    <option value="kuwait">쿠웨이트</option>
                    <option value="bahrain">바레인</option>
                    <option value="oman">오만</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    도시
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    placeholder="예: 서울, 두바이, 리야드"
                  />
                </div>
              </div>
            </div>
            
            {/* Business Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">사업 정보</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사업 형태 <span className="text-red-500">*</span>
                  </label>
                  <select name="business_type" required className="form-select">
                    <option value="">사업 형태 선택</option>
                    <option value="manufacturer">제조업</option>
                    <option value="service">서비스업</option>
                    <option value="trading">무역업</option>
                    <option value="tech">기술업</option>
                    <option value="construction">건설업</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    산업 분야 <span className="text-red-500">*</span>
                  </label>
                  <select name="industry" required className="form-select">
                    <option value="">산업 분야 선택</option>
                    <option value="energy">에너지</option>
                    <option value="construction">건설</option>
                    <option value="ict">ICT</option>
                    <option value="medical">의료기기</option>
                    <option value="automotive">자동차</option>
                    <option value="food">식품</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기업 규모 <span className="text-red-500">*</span>
                  </label>
                  <select name="company_size" required className="form-select">
                    <option value="">기업 규모 선택</option>
                    <option value="startup">스타트업</option>
                    <option value="small">소기업</option>
                    <option value="medium">중기업</option>
                    <option value="large">대기업</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설립 연도
                </label>
                <input
                  type="number"
                  name="founded_year"
                  min="1900"
                  max="2025"
                  className="form-input"
                  placeholder="예: 1969"
                />
              </div>
            </div>
            
            {/* Company Description */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">기업 소개</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기업 설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="기업의 주요 사업, 특장점, 비전 등을 간략히 설명해주세요"
                ></textarea>
              </div>
            </div>
            
            {/* Products and Technologies */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제품 및 기술</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주요 제품/서비스
                  </label>
                  <input
                    type="text"
                    name="main_products"
                    className="form-input"
                    placeholder="쉼표(,)로 구분하여 입력 - 예: 스마트폰, 반도체, 디스플레이"
                  />
                  <p className="text-sm text-gray-500 mt-1">각 항목을 쉼표로 구분하여 입력하세요</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    핵심 기술
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    className="form-input"
                    placeholder="쉼표(,)로 구분하여 입력 - 예: AI, 5G, IoT, 클라우드"
                  />
                  <p className="text-sm text-gray-500 mt-1">각 기술을 쉼표로 구분하여 입력하세요</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    보유 인증/자격
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    className="form-input"
                    placeholder="쉼표(,)로 구분하여 입력 - 예: ISO 9001, CE 인증, FDA 승인"
                  />
                  <p className="text-sm text-gray-500 mt-1">각 인증을 쉼표로 구분하여 입력하세요</p>
                </div>
              </div>
            </div>
            
            {/* Cooperation Preferences */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">협력 희망 분야</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  협력 유형 <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" name="cooperation_types" value="export" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">수출</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="cooperation_types" value="import" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">수입</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="cooperation_types" value="joint_venture" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">합작투자</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="cooperation_types" value="licensing" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">라이센싱</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="cooperation_types" value="partnership" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">파트너십</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="cooperation_types" value="investment" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2">투자</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 협력 지역
                </label>
                <input
                  type="text"
                  name="cooperation_regions"
                  className="form-input"
                  placeholder="쉼표(,)로 구분하여 입력 - 예: 중동, GCC, 아시아"
                />
                <p className="text-sm text-gray-500 mt-1">각 지역을 쉼표로 구분하여 입력하세요</p>
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">연락처 정보</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    웹사이트
                  </label>
                  <input
                    type="url"
                    name="website"
                    className="form-input"
                    placeholder="https://www.company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+82-2-1234-5678"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                <textarea
                  name="address"
                  rows={2}
                  className="form-textarea"
                  placeholder="기업의 주요 사업장 주소를 입력하세요"
                ></textarea>
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                className="btn-secondary"
                onclick="history.back()"
              >
                취소
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <i className="fas fa-save mr-2"></i>
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

// Company search page
app.get('/search', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-600">KABridge</a>
            </div>
            <div className="flex space-x-4">
              <a href="/search" className="text-blue-600 font-semibold">기업 탐색</a>
              <a href="/register" className="text-gray-700 hover:text-blue-600">기업 등록</a>
              <a href="/requests" className="text-gray-700 hover:text-blue-600">협력 요청</a>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">기업 탐색</h1>
          
          {/* Search and Filter Form */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">검색어</label>
              <input
                type="text"
                id="search"
                placeholder="기업명, 제품, 기술 검색"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">국가</label>
              <select id="country" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">전체</option>
                <option value="korea">한국</option>
                <option value="saudi_arabia">사우디아라비아</option>
                <option value="uae">UAE</option>
                <option value="qatar">카타르</option>
                <option value="kuwait">쿠웨이트</option>
                <option value="bahrain">바레인</option>
                <option value="oman">오만</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">산업 분야</label>
              <select id="industry" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">전체</option>
                <option value="energy">에너지</option>
                <option value="construction">건설</option>
                <option value="ict">ICT</option>
                <option value="medical">의료기기</option>
                <option value="automotive">자동차</option>
                <option value="food">식품</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기업 형태</label>
              <select id="business_type" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">전체</option>
                <option value="manufacturer">제조업</option>
                <option value="service">서비스업</option>
                <option value="trading">무역업</option>
                <option value="tech">기술업</option>
                <option value="construction">건설업</option>
              </select>
            </div>
          </div>
          
          <button id="search-btn" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <i className="fas fa-search mr-2"></i>
            검색
          </button>
        </div>
        
        {/* Results */}
        <div id="search-results">
          {/* Results will be loaded via JavaScript */}
        </div>
      </div>
    </div>
  )
})

// Cooperation requests page
app.get('/requests', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-600">KABridge</a>
            </div>
            <div className="flex space-x-4">
              <a href="/search" className="text-gray-700 hover:text-blue-600">기업 탐색</a>
              <a href="/register" className="text-gray-700 hover:text-blue-600">기업 등록</a>
              <a href="/requests" className="text-blue-600 font-semibold">협력 요청</a>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">협력 요청 관리</h1>
          <p className="text-gray-600 mb-6">
            받은 협력 요청과 보낸 협력 요청을 관리할 수 있습니다.
          </p>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button 
                id="received-tab"
                className="tab-button active"
                onclick="switchTab('received')"
              >
                받은 요청
                <span id="received-count" className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">0</span>
              </button>
              <button 
                id="sent-tab"
                className="tab-button"
                onclick="switchTab('sent')"
              >
                보낸 요청
                <span id="sent-count" className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">0</span>
              </button>
            </nav>
          </div>
          
          {/* Demo Company Selection (In real app, this would be user session based) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              데모용: 기업 선택 (실제 앱에서는 로그인한 기업으로 자동 설정)
            </label>
            <select id="demo-company-select" className="form-select max-w-md">
              <option value="">기업을 선택하세요</option>
              <option value="1">삼성전자</option>
              <option value="2">LG전자</option>
              <option value="3">현대자동차</option>
              <option value="4">Saudi Aramco</option>
              <option value="5">Emirates Group</option>
              <option value="6">ADNOC</option>
            </select>
          </div>
        </div>
        
        {/* Requests Content */}
        <div id="requests-content">
          <div className="text-center py-12 text-gray-500">
            위에서 기업을 선택하면 협력 요청 내역을 확인할 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  )
})

export default app
