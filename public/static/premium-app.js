// KABridge Premium App JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    // Initialize based on current page
    if (path === '/') {
        initializeHomePage();
    } else if (path === '/search') {
        initializeSearchPage();
    } else if (path === '/ai-matching') {
        initializeAIMatchingPage();
    } else if (path === '/requests') {
        initializeRequestsPage();
    }
});

// Home page initialization
function initializeHomePage() {
    loadRecentCompanies();
    loadTrendingPosts();
    setupLanguageSelector();
}

// Setup language selector
function setupLanguageSelector() {
    const container = document.getElementById('language-selector-container');
    if (container) {
        container.innerHTML = createLanguageSelector();
    }
}

// Load recent companies for home page
async function loadRecentCompanies() {
    try {
        const response = await fetch('/api/companies?limit=6');
        if (!response.ok) return;
        
        const companies = await response.json();
        renderRecentCompanies(companies);
        
    } catch (error) {
        console.error('Error loading recent companies:', error);
    }
}

// Render recent companies
function renderRecentCompanies(companies) {
    const container = document.getElementById('recent-companies');
    if (!container) return;
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fas fa-building text-4xl mb-4"></i>
                <p>등록된 기업이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = companies.map((company, index) => `
        <div class="company-card kabridge-card p-8 group kabridge-animate-fade-in industry-${company.industry}" style="animation-delay: ${index * 0.1}s">
            <div class="flex items-start justify-between mb-6">
                <div class="flex items-start space-x-4">
                    <div class="w-16 h-16 kabridge-gradient-primary rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
                        <i class="fas fa-building text-white text-xl"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="company-name text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors" 
                            data-names='{"ko":"${escapeHtml(company.name)}", "en":"${escapeHtml(company.name_en || company.name)}", "ar":"${escapeHtml(company.name_ar || company.name)}"}'
                        >${escapeHtml(getCurrentCompanyName(company))}</h4>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                            <span class="company-location flex items-center"
                                data-locations='{"ko":"${escapeHtml(company.location || '')}", "en":"${escapeHtml(company.location_en || company.location || '')}", "ar":"${escapeHtml(company.location_ar || company.location || '')}"}'
                            >
                                <i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                                ${getCurrentLocationName(company)}
                            </span>
                            <span class="hidden sm:inline text-gray-300">•</span>
                            <span class="flex items-center">
                                <i class="fas fa-industry mr-2 text-gray-400"></i>
                                ${getIndustryName(company.industry)}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <span class="industry-badge px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                        ${getIndustryName(company.industry)}
                    </span>
                    <span class="country-flag text-lg" title="${getCountryName(company.country)}">
                        ${getCountryFlag(company.country)}
                    </span>
                </div>
            </div>
            
            <p class="company-description text-gray-600 mb-6 leading-relaxed line-clamp-3"
               data-descriptions='{"ko":"${escapeHtml(company.description || '')}", "en":"${escapeHtml(company.description_en || company.description || '')}", "ar":"${escapeHtml(company.description_ar || company.description || '')}"}'
            >${escapeHtml(getCurrentDescription(company) || t('no_data'))}</p>
            
            <div class="border-t border-gray-100 pt-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-6 text-sm text-gray-500">
                        <span class="flex items-center">
                            <i class="fas fa-users mr-2 text-blue-400"></i>
                            <span class="font-medium">${formatNumber(company.employees) || 'N/A'}</span>
                            <span class="ml-1">${t('company_employees')}</span>
                        </span>
                        <span class="flex items-center">
                            <i class="fas fa-calendar mr-2 text-green-400"></i>
                            <span class="font-medium">${company.founded || 'N/A'}</span>
                        </span>
                    </div>
                    <a href="/search?company=${company.id}" class="kabridge-btn kabridge-btn-secondary text-sm px-4 py-2 group-hover:shadow-md" data-i18n="btn_view_details">
                        <span>상세보기</span>
                        <i class="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Load trending posts for home page
async function loadTrendingPosts() {
    try {
        const response = await fetch('/api/community/trending?limit=6');
        if (!response.ok) return;
        
        const data = await response.json();
        renderTrendingPosts(data.posts || []);
        
    } catch (error) {
        console.error('Error loading trending posts:', error);
        showTrendingPostsError();
    }
}

// Render trending posts
function renderTrendingPosts(posts) {
    const container = document.getElementById('trending-posts');
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fas fa-comments text-4xl mb-4"></i>
                <p>아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!</p>
                <a href="/community/new" class="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium">
                    글 작성하기 →
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                    ${getCategoryName(post.category)}
                </span>
                <span class="text-xs text-gray-500">
                    ${formatDate(post.created_at)}
                </span>
            </div>
            
            <h4 class="font-semibold text-gray-900 mb-2 line-clamp-2">
                <a href="/community/post/${post.id}" class="hover:text-blue-600 transition-colors">
                    ${escapeHtml(post.title)}
                </a>
            </h4>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                ${escapeHtml((post.content || '').substring(0, 120))}${(post.content || '').length > 120 ? '...' : ''}
            </p>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span>작성자: ${escapeHtml(post.author)}</span>
                <div class="flex items-center space-x-3">
                    <span><i class="fas fa-thumbs-up mr-1"></i>${post.likes_count || 0}</span>
                    <span><i class="fas fa-comment mr-1"></i>${post.comments_count || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Show error for trending posts
function showTrendingPostsError() {
    const container = document.getElementById('trending-posts');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-500">
            <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
            <p>게시글을 불러올 수 없습니다.</p>
            <button onclick="loadTrendingPosts()" class="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                다시 시도
            </button>
        </div>
    `;
}

// Search page initialization
function initializeSearchPage() {
    loadCompanies();
    setupSearchFilters();
}

// AI Matching page initialization
function initializeAIMatchingPage() {
    setupAIMatchingForm();
}

// Load companies for search page
async function loadCompanies(filters = {}) {
    try {
        const params = new URLSearchParams();
        
        // Add filters to params
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });
        
        const response = await fetch(`/api/companies?${params}`);
        if (!response.ok) throw new Error('Failed to load companies');
        
        const companies = await response.json();
        renderSearchResults(companies);
        
    } catch (error) {
        console.error('Error loading companies:', error);
        showSearchError();
    }
}

// Render search results
function renderSearchResults(companies) {
    const container = document.getElementById('search-results');
    if (!container) return;
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fas fa-search text-4xl mb-4"></i>
                <p>검색 조건에 맞는 기업이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = companies.map(company => `
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-building text-blue-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${escapeHtml(company.name)}</h3>
                        <p class="text-gray-500">${getCountryName(company.country)} • ${escapeHtml(company.industry)}</p>
                        <p class="text-sm text-gray-400">${escapeHtml(company.location || '')}</p>
                    </div>
                </div>
                <button 
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                    onclick="openCooperationModal(${company.id}, '${escapeHtml(company.name)}')"
                >
                    협력 요청
                </button>
            </div>
            
            <p class="text-gray-600 mb-4">${escapeHtml(company.description || '기업 설명이 없습니다.')}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-500">직원 수:</span>
                    <span class="ml-2 font-medium">${company.employees || 'N/A'}명</span>
                </div>
                <div>
                    <span class="text-gray-500">설립년도:</span>
                    <span class="ml-2 font-medium">${company.founded || 'N/A'}</span>
                </div>
                <div>
                    <span class="text-gray-500">웹사이트:</span>
                    <span class="ml-2">
                        ${company.website ? 
                            `<a href="${company.website}" target="_blank" class="text-blue-600 hover:underline">${company.website}</a>` : 
                            'N/A'
                        }
                    </span>
                </div>
                <div>
                    <span class="text-gray-500">연락처:</span>
                    <span class="ml-2 font-medium">${company.contact_email || 'N/A'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup search filters
function setupSearchFilters() {
    const form = document.getElementById('search-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const filters = {
            country: document.getElementById('country-filter')?.value,
            industry: document.getElementById('industry-filter')?.value,
            query: document.getElementById('search-query')?.value
        };
        
        loadCompanies(filters);
    });
    
    // Auto-search on filter change
    const filterInputs = form.querySelectorAll('select, input');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            const filters = {
                country: document.getElementById('country-filter')?.value,
                industry: document.getElementById('industry-filter')?.value,
                query: document.getElementById('search-query')?.value
            };
            
            loadCompanies(filters);
        });
    });
}

// Show search error
function showSearchError() {
    const container = document.getElementById('search-results');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-500">
            <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
            <p>기업 정보를 불러올 수 없습니다.</p>
            <button onclick="loadCompanies()" class="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                다시 시도
            </button>
        </div>
    `;
}

// Requests page initialization
function initializeRequestsPage() {
    setupRequestsTabs();
    loadRequests();
}

// Setup requests page tabs
function setupRequestsTabs() {
    window.switchTab = function(tabType) {
        // Update tab appearance
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.classList.add('text-gray-500', 'border-transparent');
            tab.classList.remove('text-blue-600', 'border-blue-500');
        });
        
        const activeTab = document.getElementById(`${tabType}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.classList.remove('text-gray-500', 'border-transparent');
            activeTab.classList.add('text-blue-600', 'border-blue-500');
        }
        
        // Load requests for the selected tab
        loadRequests(tabType);
    };
}

// Load cooperation requests
async function loadRequests(type = 'received') {
    const companySelect = document.getElementById('demo-company-select');
    const companyId = companySelect?.value;
    
    if (!companyId) {
        const container = document.getElementById('requests-content');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    위에서 기업을 선택하면 협력 요청 내역을 확인할 수 있습니다.
                </div>
            `;
        }
        return;
    }
    
    try {
        const endpoint = type === 'received' ? 
            `/api/requests/received/${companyId}` : 
            `/api/requests/sent/${companyId}`;
            
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to load requests');
        
        const requests = await response.json();
        renderRequests(requests, type);
        updateRequestCounts(requests);
        
    } catch (error) {
        console.error('Error loading requests:', error);
        showRequestsError();
    }
}

// Render cooperation requests
function renderRequests(requests, type) {
    const container = document.getElementById('requests-content');
    if (!container) return;
    
    if (requests.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-handshake text-4xl mb-4"></i>
                <p>${type === 'received' ? '받은 협력 요청이 없습니다.' : '보낸 협력 요청이 없습니다.'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = requests.map(request => `
        <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">
                        ${type === 'received' ? 
                            `${escapeHtml(request.from_company_name)} → ${escapeHtml(request.to_company_name)}` :
                            `${escapeHtml(request.to_company_name)} ← ${escapeHtml(request.from_company_name)}`
                        }
                    </h4>
                    <p class="text-gray-600">${escapeHtml(request.message)}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(request.status)}">
                    ${getStatusText(request.status)}
                </span>
            </div>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
                <span>요청 일시: ${formatDate(request.created_at)}</span>
                ${type === 'received' && request.status === 'pending' ? `
                    <div class="flex space-x-2">
                        <button 
                            class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            onclick="updateRequestStatus(${request.id}, 'accepted')"
                        >
                            승인
                        </button>
                        <button 
                            class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            onclick="updateRequestStatus(${request.id}, 'rejected')"
                        >
                            거부
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update request counts
function updateRequestCounts(requests) {
    const receivedCount = document.getElementById('received-count');
    const sentCount = document.getElementById('sent-count');
    
    if (receivedCount) receivedCount.textContent = requests.length;
    if (sentCount) sentCount.textContent = requests.length;
}

// Show requests error
function showRequestsError() {
    const container = document.getElementById('requests-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-12 text-gray-500">
            <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
            <p>협력 요청을 불러올 수 없습니다.</p>
            <button onclick="loadRequests()" class="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                다시 시도
            </button>
        </div>
    `;
}

// Cooperation request modal functions
function openCooperationModal(companyId, companyName) {
    // This would open a modal for sending cooperation requests
    // For now, we'll show a simple prompt
    const message = prompt(`${companyName}에게 협력 요청을 보내시겠습니까?\n\n메시지를 입력하세요:`);
    
    if (message) {
        sendCooperationRequest(companyId, message);
    }
}

async function sendCooperationRequest(toCompanyId, message) {
    try {
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from_company_id: 1, // Demo: would be from session
                to_company_id: toCompanyId,
                message: message
            })
        });
        
        if (!response.ok) throw new Error('Failed to send request');
        
        alert('협력 요청이 성공적으로 전송되었습니다!');
        
    } catch (error) {
        console.error('Error sending request:', error);
        alert('협력 요청 전송 중 오류가 발생했습니다.');
    }
}

async function updateRequestStatus(requestId, status) {
    try {
        const response = await fetch(`/api/requests/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) throw new Error('Failed to update request');
        
        // Reload requests
        loadRequests();
        
        alert(`협력 요청이 ${status === 'accepted' ? '승인' : '거부'}되었습니다.`);
        
    } catch (error) {
        console.error('Error updating request:', error);
        alert('요청 처리 중 오류가 발생했습니다.');
    }
}

// Utility functions
function getCountryName(country) {
    // i18n.js의 t() 함수를 직접 사용
    return window.t ? window.t(`countries.${country}`) || country : country;
}

function getCurrentCompanyName(company) {
    const lang = localStorage.getItem('kabridge_language') || 'ko';
    if (lang === 'ar' && company.name_ar) return company.name_ar;
    if (lang === 'en' && company.name_en) return company.name_en;
    return company.name;
}

function getCurrentLocationName(company) {
    const lang = localStorage.getItem('kabridge_language') || 'ko';
    if (lang === 'ar' && company.location_ar) return company.location_ar;
    if (lang === 'en' && company.location_en) return company.location_en;
    return company.location || '';
}

function getCurrentDescription(company) {
    const lang = localStorage.getItem('kabridge_language') || 'ko';
    if (lang === 'ar' && company.description_ar) return company.description_ar;
    if (lang === 'en' && company.description_en) return company.description_en;
    return company.description;
}

function getIndustryName(industry) {
    // i18n.js의 t() 함수를 직접 사용
    return window.t ? window.t(`industries.${industry}`) || industry : industry;
}

function getCategoryName(category) {
    const categories = {
        'market_insights': '시장 인사이트',
        'business_tips': '비즈니스 팁',
        'networking': '네트워킹',
        'qa': 'Q&A',
        'general': '자유게시판'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return '오늘';
    } else if (diffDays === 1) {
        return '어제';
    } else if (diffDays < 7) {
        return `${diffDays}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR');
    }
}

function getStatusClass(status) {
    const classes = {
        'pending': 'bg-yellow-100 text-yellow-700',
        'accepted': 'bg-green-100 text-green-700',
        'rejected': 'bg-red-100 text-red-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
}

function getStatusText(status) {
    const texts = {
        'pending': '대기중',
        'accepted': '승인됨',
        'rejected': '거부됨'
    };
    return texts[status] || status;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    if (!num) return null;
    return new Intl.NumberFormat('ko-KR').format(num);
}

function getCountryFlag(countryCode) {
    const flags = {
        'KR': '🇰🇷',
        'AE': '🇦🇪', 
        'SA': '🇸🇦',
        'QA': '🇶🇦',
        'KW': '🇰🇼',
        'BH': '🇧🇭',
        'OM': '🇴🇲',
        'JO': '🇯🇴',
        'EG': '🇪🇬'
    };
    return flags[countryCode] || '🌐';
}

// Enhanced search functionality
function setupSearchFilters() {
    const form = document.getElementById('search-form');
    const searchButton = form?.querySelector('button[type="submit"]');
    
    if (!form) return;
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Auto-search on filter change with debouncing
    let searchTimeout;
    const filterInputs = form.querySelectorAll('select, input');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
        
        // For text input, also listen to 'input' event
        if (input.type === 'text') {
            input.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(performSearch, 800);
            });
        }
    });
    
    // Setup sorting
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', performSearch);
    }
    
    // Load initial results
    performSearch();
}

// Perform search with current filters
async function performSearch() {
    const filters = getSearchFilters();
    updateResultsCount('검색 중...');
    
    try {
        await loadCompanies(filters);
    } catch (error) {
        console.error('Search error:', error);
        showSearchError();
    }
}

// Get current search filters
function getSearchFilters() {
    return {
        query: document.getElementById('search-query')?.value || '',
        country: document.getElementById('country-filter')?.value || '',
        industry: document.getElementById('industry-filter')?.value || '',
        size: document.getElementById('size-filter')?.value || '',
        sort: document.getElementById('sort-filter')?.value || 'created_at'
    };
}

// Update results count
function updateResultsCount(text) {
    const countElement = document.getElementById('results-count');
    if (countElement) {
        countElement.textContent = text;
    }
}

// Enhanced company loading with better filtering
async function loadCompanies(filters = {}) {
    try {
        const params = new URLSearchParams();
        
        // Add non-empty filters to params
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        });
        
        // Add limit for pagination
        params.append('limit', '20');
        
        const response = await fetch(`/api/companies?${params}`);
        if (!response.ok) throw new Error('Failed to load companies');
        
        const companies = await response.json();
        renderSearchResults(companies);
        
        // Update results count
        const countText = companies.length > 0 ? 
            `${companies.length}개 기업 검색됨` : 
            '검색 조건에 맞는 기업이 없습니다';
        updateResultsCount(countText);
        
    } catch (error) {
        console.error('Error loading companies:', error);
        showSearchError();
        updateResultsCount('검색 중 오류가 발생했습니다');
    }
}

// Enhanced search results rendering
function renderSearchResults(companies) {
    const container = document.getElementById('search-results');
    if (!container) return;
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <i class="fas fa-search text-gray-400 text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
                <p class="text-gray-600 mb-4">다른 검색 조건을 시도해보세요</p>
                <button onclick="clearSearchFilters()" class="kabridge-btn kabridge-btn-secondary">
                    <i class="fas fa-refresh mr-2"></i>
                    검색 조건 초기화
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = companies.map((company, index) => `
        <div class="kabridge-card p-6 hover:shadow-lg transition-all duration-300 kabridge-animate-fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="flex items-start justify-between mb-6">
                <div class="flex items-start space-x-4 flex-1">
                    <div class="w-16 h-16 kabridge-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <i class="fas fa-building text-white text-xl"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors company-name" 
                                    data-names='{"ko":"${escapeHtml(company.name)}", "en":"${escapeHtml(company.name_en || company.name)}", "ar":"${escapeHtml(company.name_ar || company.name)}"}'
                                >${escapeHtml(getCurrentCompanyName(company))}</h3>
                                <div class="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                    <span class="flex items-center company-location"
                                        data-locations='{"ko":"${escapeHtml(company.location || '')}", "en":"${escapeHtml(company.location_en || company.location || '')}", "ar":"${escapeHtml(company.location_ar || company.location || '')}"}'
                                    >
                                        <i class="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                                        ${getCurrentLocationName(company)}
                                    </span>
                                    <span class="flex items-center">
                                        <i class="fas fa-industry mr-2 text-gray-400"></i>
                                        ${getIndustryName(company.industry)}
                                    </span>
                                    <span class="flex items-center">
                                        <i class="fas fa-users mr-2 text-gray-400"></i>
                                        ${formatNumber(company.employees) || 'N/A'}명
                                    </span>
                                </div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                                <span class="country-flag text-2xl" title="${getCountryName(company.country)}">
                                    ${getCountryFlag(company.country)}
                                </span>
                                <span class="industry-badge px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                    ${getIndustryName(company.industry)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <p class="text-gray-600 leading-relaxed mb-4 company-description"
                   data-descriptions='{"ko":"${escapeHtml(company.description || '')}", "en":"${escapeHtml(company.description_en || company.description || '')}", "ar":"${escapeHtml(company.description_ar || company.description || '')}"}'
                >${escapeHtml(getCurrentDescription(company) || t('no_data'))}</p>
                
                ${company.cooperation_needs ? `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div class="flex items-start">
                            <i class="fas fa-lightbulb text-blue-600 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-blue-900 mb-2">협력 니즈</h4>
                                <p class="text-blue-700 text-sm leading-relaxed">${escapeHtml(company.cooperation_needs)}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${company.competitive_advantages ? `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div class="flex items-start">
                            <i class="fas fa-medal text-green-600 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-green-900 mb-2">경쟁 우위</h4>
                                <p class="text-green-700 text-sm">${escapeHtml(company.competitive_advantages)}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="border-t border-gray-100 pt-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span class="flex items-center">
                            <i class="fas fa-calendar mr-2 text-blue-400"></i>
                            <span class="font-medium">${company.founded || 'N/A'}</span>
                        </span>
                        <span class="flex items-center">
                            <i class="fas fa-globe mr-2 text-green-400"></i>
                            <span class="font-medium">${company.export_ratio || 0}% 수출</span>
                        </span>
                        ${company.contact_person ? `
                            <span class="flex items-center">
                                <i class="fas fa-user mr-2 text-purple-400"></i>
                                <span class="font-medium">${escapeHtml(company.contact_person)}</span>
                            </span>
                        ` : ''}
                    </div>
                    <div class="flex gap-2">
                        <button 
                            class="kabridge-btn kabridge-btn-secondary text-sm px-4 py-2"
                            onclick="viewCompanyDetails(${company.id})"
                        >
                            <i class="fas fa-info-circle mr-2"></i>
                            상세정보
                        </button>
                        <button 
                            class="kabridge-btn kabridge-btn-primary text-sm px-4 py-2"
                            onclick="openCooperationModal(${company.id}, '${escapeHtml(company.name)}')"
                        >
                            <i class="fas fa-handshake mr-2"></i>
                            협력요청
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Clear search filters
function clearSearchFilters() {
    document.getElementById('search-query').value = '';
    document.getElementById('country-filter').value = '';
    document.getElementById('industry-filter').value = '';
    document.getElementById('size-filter').value = '';
    document.getElementById('sort-filter').value = 'created_at';
    performSearch();
}

// View company details
function viewCompanyDetails(companyId) {
    // For now, just show an alert. In a real app, this would open a modal or navigate to a detail page
    alert(`기업 상세 정보 페이지로 이동합니다. (Company ID: ${companyId})`);
}

// Setup AI Matching Form
function setupAIMatchingForm() {
    const form = document.getElementById('ai-matching-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await performAIMatching();
    });
}

// Perform AI Matching
async function performAIMatching() {
    const form = document.getElementById('ai-matching-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const resultsContainer = document.getElementById('matching-results');
    
    if (!form || !submitButton || !resultsContainer) return;
    
    // Get form data
    const formData = new FormData(form);
    const matchingData = {
        company_name: document.getElementById('company-name').value,
        company_industry: document.getElementById('company-industry').value,
        cooperation_purpose: document.getElementById('cooperation-purpose').value,
        keywords: document.getElementById('keywords').value,
        investment_scale: document.getElementById('investment-scale').value,
        cooperation_types: Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
            .filter(cb => cb.value !== 'KR' && cb.value !== 'AE' && cb.value !== 'SA' && cb.value !== 'QA')
            .map(cb => cb.value),
        target_regions: Array.from(form.querySelectorAll('input[value="KR"], input[value="AE"], input[value="SA"], input[value="QA"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.value)
    };
    
    // Validate required fields
    if (!matchingData.company_name || !matchingData.company_industry || !matchingData.cooperation_purpose) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            AI 분석 중...
        </div>
    `;
    
    try {
        const response = await fetch('/api/ai-matching', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchingData)
        });
        
        if (!response.ok) throw new Error('AI 매칭 요청 실패');
        
        const result = await response.json();
        
        if (result.success && result.matches) {
            displayMatchingResults(result.matches);
            resultsContainer.style.display = 'block';
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error('매칭 결과를 받을 수 없습니다');
        }
        
    } catch (error) {
        console.error('AI Matching error:', error);
        alert('AI 매칭 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = `
            <i class="fas fa-magic mr-3"></i>
            AI 매칭 시작하기
        `;
    }
}

// Display AI matching results
function displayMatchingResults(matches) {
    const container = document.getElementById('matched-companies');
    if (!container) return;
    
    if (matches.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-search text-4xl mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">매칭 결과가 없습니다</h3>
                <p>검색 조건을 조정하여 다시 시도해보세요</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = matches.map((company, index) => `
        <div class="kabridge-card p-6 kabridge-animate-fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-start space-x-4">
                    <div class="w-16 h-16 kabridge-gradient-primary rounded-2xl flex items-center justify-center">
                        <i class="fas fa-building text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(company.name)}</h3>
                        <div class="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span><i class="fas fa-map-marker-alt mr-2"></i>${escapeHtml(company.location)} (${getCountryName(company.country)})</span>
                            <span><i class="fas fa-industry mr-2"></i>${getIndustryName(company.industry)}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                ${company.matching_score}% 매칭
                            </span>
                            <span class="text-xs text-gray-500">
                                업종 ${company.industry_match}% • 지역 ${company.location_match}% • 키워드 ${company.keyword_match}%
                            </span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl mb-2">${getCountryFlag(company.country)}</div>
                    <button 
                        class="kabridge-btn kabridge-btn-primary text-sm px-4 py-2"
                        onclick="openCooperationModal(${company.id}, '${escapeHtml(company.name)}')"
                    >
                        <i class="fas fa-paper-plane mr-2"></i>
                        연락하기
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <p class="text-gray-600 leading-relaxed mb-4">${escapeHtml(company.description)}</p>
                
                ${company.cooperation_needs ? `
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <h4 class="font-medium text-blue-900 mb-1">협력 니즈</h4>
                        <p class="text-blue-700 text-sm">${escapeHtml(company.cooperation_needs)}</p>
                    </div>
                ` : ''}
                
                <div class="bg-green-50 border-l-4 border-green-400 p-4">
                    <h4 class="font-medium text-green-900 mb-1 flex items-center">
                        <i class="fas fa-robot mr-2"></i>
                        AI 매칭 분석
                    </h4>
                    <p class="text-green-700 text-sm">${company.explanation}</p>
                    ${company.matched_keywords && company.matched_keywords.length > 0 ? `
                        <div class="mt-2">
                            <span class="text-green-800 text-xs font-medium">매칭된 키워드:</span>
                            ${company.matched_keywords.map(keyword => `
                                <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-1">${keyword}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="border-t border-gray-100 pt-4">
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <div class="flex space-x-4">
                        <span><i class="fas fa-users mr-1"></i>${formatNumber(company.employees)}명</span>
                        <span><i class="fas fa-calendar mr-1"></i>${company.founded}</span>
                        <span><i class="fas fa-globe mr-1"></i>수출 ${company.export_ratio}%</span>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            class="text-blue-600 hover:text-blue-700 font-medium"
                            onclick="viewCompanyDetails(${company.id})"
                        >
                            상세보기 →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}