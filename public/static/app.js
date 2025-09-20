// KABridge Platform Frontend JavaScript

// Utility functions
const API_BASE = '/api'

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(API_BASE + endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Company card component
function createCompanyCard(company) {
  const mainProducts = company.main_products ? JSON.parse(company.main_products) : []
  const technologies = company.technologies ? JSON.parse(company.technologies) : []
  const cooperationTypes = company.cooperation_types ? JSON.parse(company.cooperation_types) : []
  
  const cooperationTypeLabels = {
    'export': '수출',
    'import': '수입', 
    'joint_venture': '합작투자',
    'licensing': '라이센싱',
    'partnership': '파트너십',
    'investment': '투자'
  }
  
  const industryLabels = {
    'energy': '에너지',
    'construction': '건설',
    'ict': 'ICT',
    'medical': '의료기기',
    'automotive': '자동차',
    'food': '식품',
    'other': '기타'
  }
  
  const countryLabels = {
    'korea': '한국',
    'saudi_arabia': '사우디아라비아',
    'uae': 'UAE',
    'qatar': '카타르',
    'kuwait': '쿠웨이트',
    'bahrain': '바레인',
    'oman': '오만'
  }
  
  return `
    <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-900">${company.company_name}</h3>
          ${company.company_name_en ? `<p class="text-gray-600">${company.company_name_en}</p>` : ''}
          <div class="flex items-center mt-2 text-sm text-gray-500">
            <i class="fas fa-map-marker-alt mr-1"></i>
            <span>${countryLabels[company.country] || company.country}</span>
            <span class="mx-2">•</span>
            <span>${industryLabels[company.industry] || company.industry}</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="addToFavorites(${company.id})" class="text-gray-400 hover:text-red-500">
            <i class="far fa-heart"></i>
          </button>
          <button onclick="sendCooperationRequest(${company.id})" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            협력 요청
          </button>
        </div>
      </div>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">${company.description || ''}</p>
      
      ${mainProducts.length > 0 ? `
        <div class="mb-3">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">주요 제품/서비스</span>
          <div class="flex flex-wrap gap-1 mt-1">
            ${mainProducts.slice(0, 3).map(product => 
              `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${product}</span>`
            ).join('')}
            ${mainProducts.length > 3 ? `<span class="text-xs text-gray-500">+${mainProducts.length - 3} more</span>` : ''}
          </div>
        </div>
      ` : ''}
      
      ${technologies.length > 0 ? `
        <div class="mb-3">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">핵심 기술</span>
          <div class="flex flex-wrap gap-1 mt-1">
            ${technologies.slice(0, 3).map(tech => 
              `<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${tech}</span>`
            ).join('')}
            ${technologies.length > 3 ? `<span class="text-xs text-gray-500">+${technologies.length - 3} more</span>` : ''}
          </div>
        </div>
      ` : ''}
      
      ${cooperationTypes.length > 0 ? `
        <div>
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">협력 분야</span>
          <div class="flex flex-wrap gap-1 mt-1">
            ${cooperationTypes.map(type => 
              `<span class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">${cooperationTypeLabels[type] || type}</span>`
            ).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `
}

// Load recent companies on home page
async function loadRecentCompanies() {
  const container = document.getElementById('recent-companies')
  if (!container) return
  
  try {
    container.innerHTML = '<div class="col-span-3 text-center py-8"><i class="fas fa-spinner fa-spin text-gray-400 text-2xl"></i><p class="text-gray-500 mt-2">기업 정보를 불러오는 중...</p></div>'
    
    const data = await fetchAPI('/companies?limit=6')
    
    if (data.companies && data.companies.length > 0) {
      container.innerHTML = data.companies.map(company => createCompanyCard(company)).join('')
    } else {\n      container.innerHTML = '<div class=\"col-span-3 text-center py-8 text-gray-500\">등록된 기업이 없습니다.</div>'\n    }\n  } catch (error) {\n    console.error('Failed to load recent companies:', error)\n    container.innerHTML = '<div class=\"col-span-3 text-center py-8 text-red-500\">기업 정보를 불러오는데 실패했습니다.</div>'\n  }\n}\n\n// Search companies\nasync function searchCompanies() {\n  const resultsContainer = document.getElementById('search-results')\n  if (!resultsContainer) return\n  \n  const search = document.getElementById('search')?.value || ''\n  const country = document.getElementById('country')?.value || ''\n  const industry = document.getElementById('industry')?.value || ''\n  const business_type = document.getElementById('business_type')?.value || ''\n  \n  const params = new URLSearchParams()\n  if (search) params.append('search', search)\n  if (country) params.append('country', country)\n  if (industry) params.append('industry', industry)\n  if (business_type) params.append('business_type', business_type)\n  \n  try {\n    resultsContainer.innerHTML = '<div class=\"text-center py-8\"><i class=\"fas fa-spinner fa-spin text-gray-400 text-2xl\"></i><p class=\"text-gray-500 mt-2\">검색 중...</p></div>'\n    \n    const data = await fetchAPI(`/companies?${params.toString()}`)\n    \n    if (data.companies && data.companies.length > 0) {\n      resultsContainer.innerHTML = `\n        <div class=\"mb-4 text-gray-600\">\n          총 ${data.companies.length}개의 기업을 찾았습니다.\n        </div>\n        <div class=\"grid md:grid-cols-2 lg:grid-cols-3 gap-6\">\n          ${data.companies.map(company => createCompanyCard(company)).join('')}\n        </div>\n      `\n    } else {\n      resultsContainer.innerHTML = '<div class=\"text-center py-8 text-gray-500\">검색 조건에 맞는 기업이 없습니다.</div>'\n    }\n  } catch (error) {\n    console.error('Failed to search companies:', error)\n    resultsContainer.innerHTML = '<div class=\"text-center py-8 text-red-500\">검색에 실패했습니다.</div>'\n  }\n}\n\n// Send cooperation request\nfunction sendCooperationRequest(companyId) {\n  // For now, show an alert. In a real implementation, this would open a modal form\n  alert(`기업 ID ${companyId}에 협력 요청을 보내는 기능은 추후 구현 예정입니다.`)\n}\n\n// Add to favorites\nfunction addToFavorites(companyId) {\n  // For now, show an alert. In a real implementation, this would add to favorites\n  alert(`기업 ID ${companyId}를 즐겨찾기에 추가하는 기능은 추후 구현 예정입니다.`)\n}\n\n// Initialize page functionality\ndocument.addEventListener('DOMContentLoaded', function() {\n  // Load recent companies on home page\n  loadRecentCompanies()\n  \n  // Setup search functionality\n  const searchBtn = document.getElementById('search-btn')\n  if (searchBtn) {\n    searchBtn.addEventListener('click', searchCompanies)\n  }\n  \n  // Setup enter key for search\n  const searchInput = document.getElementById('search')\n  if (searchInput) {\n    searchInput.addEventListener('keypress', function(e) {\n      if (e.key === 'Enter') {\n        searchCompanies()\n      }\n    })\n  }\n  \n  // Load initial search results\n  if (document.getElementById('search-results')) {\n    searchCompanies()\n  }\n})"
// Company registration form handler
async function submitCompanyRegistration(event) {
  event.preventDefault()
  
  const form = event.target
  const formData = new FormData(form)
  
  // Convert FormData to JSON
  const data = {}
  for (let [key, value] of formData.entries()) {
    if (key === 'cooperation_types') {
      // Handle multiple checkbox values
      if (!data[key]) data[key] = []
      data[key].push(value)
    } else {
      data[key] = value
    }
  }
  
  // Convert cooperation_types array to JSON string
  if (data.cooperation_types) {
    data.cooperation_types = JSON.stringify(data.cooperation_types)
  }
  
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  
  try {
    // Show loading state
    submitBtn.disabled = true
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>등록 중...'
    
    const response = await fetchAPI('/companies', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    // Show success message
    alert('기업 등록이 완료되었습니다! 기업 탐색 페이지에서 확인하실 수 있습니다.')
    
    // Redirect to search page
    window.location.href = '/search'
    
  } catch (error) {
    console.error('Registration error:', error)
    alert('기업 등록 중 오류가 발생했습니다. 다시 시도해주세요.')
  } finally {
    // Restore button state
    submitBtn.disabled = false
    submitBtn.innerHTML = originalText
  }
}

// Update the DOMContentLoaded event listener to include registration form
document.addEventListener('DOMContentLoaded', function() {
  // Load recent companies on home page
  loadRecentCompanies()
  
  // Setup search functionality
  const searchBtn = document.getElementById('search-btn')
  if (searchBtn) {
    searchBtn.addEventListener('click', searchCompanies)
  }
  
  // Setup enter key for search
  const searchInput = document.getElementById('search')
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchCompanies()
      }
    })
  }
  
  // Setup company registration form
  const registrationForm = document.getElementById('company-registration-form')
  if (registrationForm) {
    registrationForm.addEventListener('submit', submitCompanyRegistration)
  }
  
  // Load initial search results
  if (document.getElementById('search-results')) {
    searchCompanies()
  }
})

// Cooperation Requests Management
let currentTab = 'received'
let selectedCompanyId = null

function switchTab(tab) {
  currentTab = tab
  
  // Update tab buttons
  document.getElementById('received-tab').className = tab === 'received' ? 'tab-button active' : 'tab-button'
  document.getElementById('sent-tab').className = tab === 'sent' ? 'tab-button active' : 'tab-button'
  
  // Load requests for current tab
  if (selectedCompanyId) {
    loadCooperationRequests()
  }
}

async function loadCooperationRequests() {
  if (!selectedCompanyId) return
  
  const content = document.getElementById('requests-content')
  
  try {
    content.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-gray-400 text-2xl"></i><p class="text-gray-500 mt-2">요청 내역을 불러오는 중...</p></div>'
    
    const data = await fetchAPI(`/cooperation-requests/${selectedCompanyId}?type=${currentTab}`)
    
    // Update counts
    document.getElementById(`${currentTab}-count`).textContent = data.requests.length
    
    if (data.requests.length > 0) {
      content.innerHTML = `
        <div class="space-y-4">
          ${data.requests.map(request => createRequestCard(request)).join('')}
        </div>
      `
    } else {
      content.innerHTML = `
        <div class="text-center py-12 text-gray-500">
          <i class="fas fa-inbox text-4xl mb-4"></i>
          <p>${currentTab === 'received' ? '받은' : '보낸'} 협력 요청이 없습니다.</p>
        </div>
      `
    }
  } catch (error) {
    console.error('Failed to load cooperation requests:', error)
    content.innerHTML = '<div class="text-center py-8 text-red-500">요청 내역을 불러오는데 실패했습니다.</div>'
  }
}

function createRequestCard(request) {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'accepted': 'bg-green-100 text-green-800', 
    'rejected': 'bg-red-100 text-red-800',
    'withdrawn': 'bg-gray-100 text-gray-800'
  }
  
  const statusLabels = {
    'pending': '대기 중',
    'accepted': '승인됨',
    'rejected': '거절됨',
    'withdrawn': '철회됨'
  }
  
  const cooperationTypeLabels = {
    'export': '수출',
    'import': '수입',
    'joint_venture': '합작투자',
    'licensing': '라이센싱',
    'partnership': '파트너십',
    'investment': '투자'
  }
  
  const countryLabels = {
    'korea': '한국',
    'saudi_arabia': '사우디아라비아',
    'uae': 'UAE',
    'qatar': '카타르',
    'kuwait': '쿠웨이트',
    'bahrain': '바레인',
    'oman': '오만'
  }
  
  return `
    <div class="bg-white rounded-lg border p-6">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-900">${request.other_company_name}</h3>
            <span class="ml-3 px-2 py-1 text-xs font-medium rounded ${statusColors[request.status]}">
              ${statusLabels[request.status]}
            </span>
          </div>
          <div class="flex items-center text-sm text-gray-500 mb-2">
            <i class="fas fa-map-marker-alt mr-1"></i>
            <span>${countryLabels[request.other_country] || request.other_country}</span>
            <span class="mx-2">•</span>
            <span>${cooperationTypeLabels[request.cooperation_type] || request.cooperation_type}</span>
            <span class="mx-2">•</span>
            <span>${new Date(request.created_at).toLocaleDateString('ko-KR')}</span>
          </div>
          <h4 class="font-medium text-gray-900 mb-2">${request.subject}</h4>
          <p class="text-gray-600 text-sm line-clamp-2">${request.message}</p>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2">
        ${currentTab === 'received' && request.status === 'pending' ? `
          <button 
            onclick="updateRequestStatus(${request.id}, 'accepted')" 
            class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            <i class="fas fa-check mr-1"></i>
            승인
          </button>
          <button 
            onclick="updateRequestStatus(${request.id}, 'rejected')" 
            class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
          >
            <i class="fas fa-times mr-1"></i>
            거절
          </button>
        ` : ''}
        ${currentTab === 'sent' && request.status === 'pending' ? `
          <button 
            onclick="updateRequestStatus(${request.id}, 'withdrawn')" 
            class="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          >
            <i class="fas fa-undo mr-1"></i>
            철회
          </button>
        ` : ''}
        <button 
          onclick="viewRequestDetails(${request.id})" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          <i class="fas fa-eye mr-1"></i>
          상세보기
        </button>
      </div>
    </div>
  `
}

async function updateRequestStatus(requestId, status) {
  try {
    await fetchAPI(`/cooperation-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    
    // Reload requests
    loadCooperationRequests()
    
    alert('요청 상태가 업데이트되었습니다.')
  } catch (error) {
    console.error('Failed to update request status:', error)
    alert('상태 업데이트에 실패했습니다.')
  }
}

function viewRequestDetails(requestId) {
  // For now, show an alert. In a real implementation, this would open a modal or navigate to details page
  alert(`요청 ID ${requestId}의 상세 정보를 보는 기능은 추후 구현 예정입니다.`)
}

// Add CSS for tab buttons
const style = document.createElement('style')
style.textContent = `
  .tab-button {
    border-bottom: 2px solid transparent;
    padding: 0.5rem 0;
    font-medium: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tab-button:hover {
    color: #3b82f6;
    border-bottom-color: #dbeafe;
  }
  
  .tab-button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }
`
document.head.appendChild(style)

// Update DOMContentLoaded to include cooperation requests
document.addEventListener('DOMContentLoaded', function() {
  // Load recent companies on home page
  loadRecentCompanies()
  
  // Setup search functionality
  const searchBtn = document.getElementById('search-btn')
  if (searchBtn) {
    searchBtn.addEventListener('click', searchCompanies)
  }
  
  // Setup enter key for search
  const searchInput = document.getElementById('search')
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchCompanies()
      }
    })
  }
  
  // Setup company registration form
  const registrationForm = document.getElementById('company-registration-form')
  if (registrationForm) {
    registrationForm.addEventListener('submit', submitCompanyRegistration)
  }
  
  // Setup cooperation requests page
  const companySelect = document.getElementById('demo-company-select')
  if (companySelect) {
    companySelect.addEventListener('change', function(e) {
      selectedCompanyId = e.target.value
      if (selectedCompanyId) {
        loadCooperationRequests()
      } else {
        document.getElementById('requests-content').innerHTML = '<div class="text-center py-12 text-gray-500">위에서 기업을 선택하면 협력 요청 내역을 확인할 수 있습니다.</div>'
      }
    })
  }
  
  // Load initial search results
  if (document.getElementById('search-results')) {
    searchCompanies()
  }
})
