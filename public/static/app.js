// KABridge Enhanced App JavaScript
// Complete implementation with language switching and community features

console.log('KABridge app.js loaded successfully');

// Global state
let currentLanguage = 'ko';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('KABridge app initialized');
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    // Initialize language system
    initializeLanguageSystem();
    
    // Initialize based on current page
    if (path === '/') {
        console.log('Initializing home page...');
        initializeHomePage();
    } else if (path === '/search') {
        initializeSearchPage();
    } else if (path === '/ai-matching') {
        initializeAIMatchingPage();
    } else if (path === '/community') {
        initializeCommunityPage();
    } else if (path === '/requests') {
        initializeRequestsPage();
    }
});

// Language System
function initializeLanguageSystem() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Get saved language or default to Korean
    currentLanguage = localStorage.getItem('kabridge-language') || 'ko';
    updateLanguageDisplay(currentLanguage);
    
    if (languageBtn && languageDropdown) {
        // Toggle dropdown
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            languageDropdown.classList.remove('active');
        });
        
        // Language option selection
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const selectedLang = this.getAttribute('data-lang');
                setLanguage(selectedLang);
                languageDropdown.classList.remove('active');
            });
        });
    }
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('kabridge-language', lang);
    updateLanguageDisplay(lang);
    
    // Update language button
    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        const flagAndText = lang === 'ko' ? '🇰🇷 한국어' : '🇸🇦 العربية';
        languageBtn.querySelector('span').textContent = flagAndText;
    }
    
    // Update active language option
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-lang') === lang);
    });
    
    // Reload content based on new language preference
    const path = window.location.pathname;
    if (path === '/') {
        // Reload recent companies with language preference
        loadRecentCompanies();
    } else if (path === '/search') {
        // Re-run current search with language preference
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            performSearch();
        }
    } else if (path === '/community') {
        // Reload community posts
        const activeCategoryBtn = document.querySelector('.category-btn.active');
        const category = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : '';
        loadCommunityPosts(category);
    }
}

function updateLanguageDisplay(lang) {
    const html = document.documentElement;
    
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        html.classList.add('font-arabic');
        
        // Show Arabic text, hide Korean text
        document.querySelectorAll('.lang-ko').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.lang-ar').forEach(el => el.classList.remove('hidden'));
    } else {
        html.setAttribute('lang', 'ko');
        html.setAttribute('dir', 'ltr');
        html.classList.remove('font-arabic');
        
        // Show Korean text, hide Arabic text
        document.querySelectorAll('.lang-ko').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.lang-ar').forEach(el => el.classList.add('hidden'));
    }
    
    // Dispatch language change event
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Home page initialization
function initializeHomePage() {
    loadRecentCompanies();
    loadRecentPosts();
    setupMainAIForm();
}

// Load recent posts for home page
async function loadRecentPosts() {
    try {
        console.log('Loading recent posts...');
        const response = await axios.get('/api/posts?limit=6');
        const data = response.data;
        console.log('Posts loaded:', data.posts?.length || 0);
        renderRecentPosts(data.posts || []);
        
    } catch (error) {
        console.error('Error loading recent posts:', error);
        renderRecentPosts([]);
    }
}

// Load recent companies for home page with language preference
async function loadRecentCompanies() {
    try {
        console.log('Loading recent companies...');
        // Language-based prioritization without strict filtering
        const params = new URLSearchParams({
            limit: '6',
            lang: currentLanguage
        });
        
        const response = await axios.get(`/api/companies?${params.toString()}`);
        const data = response.data;
        console.log('Companies loaded:', data.companies?.length || 0);
        renderRecentCompanies(data.companies || []);
        
    } catch (error) {
        console.error('Error loading recent companies:', error);
        renderRecentCompanies([]);
    }
}

// Render recent companies with multilingual support
function renderRecentCompanies(companies) {
    const container = document.getElementById('recent-companies');
    if (!container) return;
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fas fa-building text-4xl mb-4"></i>
                <p class="lang-ko">등록된 기업이 없습니다.</p>
                <p class="lang-ar hidden">لا توجد شركات مسجلة.</p>
            </div>
        `;
        updateLanguageDisplay(currentLanguage);
        return;
    }
    
    container.innerHTML = companies.map(company => `
        <div class="kabridge-profile-card">
            <div class="profile-card-header">
                <div class="profile-avatar-wrapper">
                    <div class="profile-avatar">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="profile-status-indicator"></div>
                </div>
                <div class="profile-basic-info">
                    <h3 class="profile-company-name text-safe">${getMultilingualText(company, 'name')}</h3>
                    <div class="profile-meta">
                        <span class="profile-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${getMultilingualText(company, 'location')}
                        </span>
                        <span class="profile-industry">
                            ${getCountryFlag(company.country)} ${getIndustryName(company.industry)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="profile-card-body">
                <div class="profile-section">
                    <div class="profile-description text-safe line-clamp-2">
                        ${getMultilingualText(company, 'description')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h4 class="profile-section-title">
                        <span class="lang-ko">협력 분야</span>
                        <span class="lang-ar hidden">مجال التعاون</span>
                    </h4>
                    <div class="profile-cooperation text-safe line-clamp-2">
                        ${getMultilingualText(company, 'cooperation_needs')}
                    </div>
                </div>
            </div>
            
            <div class="profile-card-footer">
                <div class="profile-tags">
                    <span class="profile-tag">${getIndustryName(company.industry)}</span>
                    ${company.country === 'KR' ? '<span class="profile-tag profile-tag-korean">Korean</span>' : '<span class="profile-tag profile-tag-arab">Arab</span>'}
                </div>
                <div class="profile-action-buttons">
                    <button class="profile-action-btn profile-action-btn-secondary" onclick="openDMModal('${company.id}', '${getMultilingualText(company, 'name').replace(/'/g, "\\'")}')">
                        <i class="fas fa-envelope mr-2"></i>
                        <span class="lang-ko">메시지</span>
                        <span class="lang-ar hidden">رسالة</span>
                    </button>
                    <button class="profile-action-btn">
                        <span class="lang-ko">연결하기</span>
                        <span class="lang-ar hidden">الاتصال</span>
                        <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateLanguageDisplay(currentLanguage);
}

// Render recent posts for home page
function renderRecentPosts(posts) {
    const container = document.getElementById('recent-posts');
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fas fa-comments text-4xl mb-4"></i>
                <p class="lang-ko">등록된 게시글이 없습니다.</p>
                <p class="lang-ar hidden">لا توجد منشورات مسجلة.</p>
            </div>
        `;
        updateLanguageDisplay(currentLanguage);
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="kabridge-card p-6 hover:shadow-lg transition-all duration-300">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-kabridge-blue to-blue-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-900">${post.author || 'KABridge User'}</h3>
                        <p class="text-xs text-gray-500">${formatDate(post.created_at)}</p>
                    </div>
                </div>
                <span class="px-3 py-1 bg-kabridge-blue/10 text-kabridge-blue text-xs rounded-full">
                    ${getCategoryName(post.category)}
                </span>
            </div>
            
            <h4 class="font-semibold text-gray-900 mb-2 line-clamp-2">
                ${getMultilingualText(post, 'title')}
            </h4>
            
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">
                ${getMultilingualText(post, 'content')}
            </p>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span><i class="fas fa-heart mr-1"></i>${post.likes || 0}</span>
                    <span><i class="fas fa-comment mr-1"></i>${post.comments || 0}</span>
                </div>
                <a href="/community" class="text-kabridge-blue hover:text-blue-800 font-medium text-sm">
                    <span class="lang-ko">자세히 보기</span>
                    <span class="lang-ar hidden">عرض التفاصيل</span>
                    <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </div>
    `).join('');
    
    updateLanguageDisplay(currentLanguage);
}

// Search page initialization
function initializeSearchPage() {
    setupSearchFilters();
    performSearch();
}

function setupSearchFilters() {
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const industryFilter = document.getElementById('industryFilter');
    const searchBtn = document.getElementById('searchBtn');
    
    let searchTimeout;
    
    function handleSearchInput() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    }
    
    if (searchInput) searchInput.addEventListener('input', handleSearchInput);
    if (countryFilter) countryFilter.addEventListener('change', performSearch);
    if (industryFilter) industryFilter.addEventListener('change', performSearch);
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const industryFilter = document.getElementById('industryFilter');
    const searchResults = document.getElementById('searchResults');
    const loadingState = document.getElementById('loadingState');
    const noResultsState = document.getElementById('noResultsState');
    const searchStats = document.getElementById('searchStats');
    
    if (loadingState) loadingState.classList.remove('hidden');
    if (searchResults) searchResults.innerHTML = '';
    if (noResultsState) noResultsState.classList.add('hidden');
    
    try {
        const params = new URLSearchParams();
        
        const searchValue = searchInput ? searchInput.value.trim() : '';
        const countryValue = countryFilter ? countryFilter.value : '';
        const industryValue = industryFilter ? industryFilter.value : '';
        
        if (searchValue) params.set('search', searchValue);
        if (countryValue) params.set('country', countryValue);
        if (industryValue) params.set('industry', industryValue);
        params.set('lang', currentLanguage);
        params.set('limit', '20');
        
        const response = await axios.get(`/api/companies?${params.toString()}`);
        const data = response.data;
        
        if (loadingState) loadingState.classList.add('hidden');
        
        if (searchStats) {
            const statsText = currentLanguage === 'ko' 
                ? `총 ${data.total || 0}개 기업 중 ${(data.companies || []).length}개 표시`
                : `عرض ${(data.companies || []).length} من أصل ${data.total || 0} شركة`;
            searchStats.textContent = statsText;
        }
        
        if (data.companies && data.companies.length > 0) {
            renderSearchResults(data.companies);
        } else {
            if (noResultsState) noResultsState.classList.remove('hidden');
            updateLanguageDisplay(currentLanguage);
        }
        
    } catch (error) {
        console.error('Search error:', error);
        if (loadingState) loadingState.classList.add('hidden');
        if (noResultsState) noResultsState.classList.remove('hidden');
        updateLanguageDisplay(currentLanguage);
    }
}

function renderSearchResults(companies) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    container.innerHTML = companies.map(company => `
        <div class="kabridge-profile-card kabridge-profile-card-detailed">
            <div class="profile-card-header">
                <div class="profile-avatar-wrapper">
                    <div class="profile-avatar">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="profile-status-indicator"></div>
                </div>
                <div class="profile-basic-info">
                    <h3 class="profile-company-name text-safe">${getMultilingualText(company, 'name')}</h3>
                    <div class="profile-meta">
                        <span class="profile-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${getMultilingualText(company, 'location')}
                        </span>
                        <span class="profile-industry">
                            ${getCountryFlag(company.country)} ${getIndustryName(company.industry)}
                        </span>
                        <span class="profile-employees">
                            <i class="fas fa-users"></i>
                            ${company.employee_count || 'N/A'}명
                        </span>
                    </div>
                </div>
                <div class="profile-badge-wrapper">
                    <span class="profile-badge profile-badge-${company.country === 'KR' ? 'korean' : 'arab'}">
                        ${company.country === 'KR' ? 'Korean' : 'Arab'}
                    </span>
                </div>
            </div>
            
            <div class="profile-card-body">
                <div class="profile-section">
                    <div class="profile-description text-safe line-clamp-3">
                        ${getMultilingualText(company, 'description')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h4 class="profile-section-title">
                        <span class="lang-ko">협력 분야</span>
                        <span class="lang-ar hidden">مجال التعاون</span>
                    </h4>
                    <div class="profile-cooperation text-safe line-clamp-2">
                        ${getMultilingualText(company, 'cooperation_needs')}
                    </div>
                </div>
            </div>
            
            <div class="profile-card-footer">
                <div class="profile-tags">
                    <span class="profile-tag">${getIndustryName(company.industry)}</span>
                    <span class="profile-tag">
                        <i class="fas fa-users mr-1"></i>
                        ${company.employee_count || 'N/A'}명
                    </span>
                </div>
                <div class="profile-action-buttons">
                    <button class="profile-action-btn profile-action-btn-secondary" onclick="openDMModal('${company.id}', '${getMultilingualText(company, 'name').replace(/'/g, "\\'")}')">
                        <i class="fas fa-envelope mr-2"></i>
                        <span class="lang-ko">메시지</span>
                        <span class="lang-ar hidden">رسالة</span>
                    </button>
                    <button class="profile-action-btn">
                        <span class="lang-ko">자세히 보기</span>
                        <span class="lang-ar hidden">عرض التفاصيل</span>
                        <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateLanguageDisplay(currentLanguage);
}

// AI Matching page
function initializeAIMatchingPage() {
    setupAIMatchingForm();
}

function setupAIMatchingForm() {
    const form = document.getElementById('aiMatchingForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cooperationPurpose = document.getElementById('cooperationPurpose').value.trim();
        const userCountry = document.getElementById('userCountry').value;
        
        if (!cooperationPurpose) {
            const alertText = currentLanguage === 'ko' 
                ? '협력 희망 분야를 입력해주세요.' 
                : 'يرجى إدخال مجال التعاون المطلوب.';
            alert(alertText);
            return;
        }
        
        await performAIMatching(cooperationPurpose, userCountry);
    });
}

async function performAIMatching(cooperationPurpose, userCountry) {
    const loadingState = document.getElementById('matchingLoading');
    const resultsContainer = document.getElementById('matchingResults');
    const resultsList = document.getElementById('matchingResultsList');
    
    if (loadingState) loadingState.classList.remove('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');
    
    try {
        const response = await axios.post('/api/ai-matching', {
            cooperation_purpose: cooperationPurpose,
            user_country: userCountry
        });
        
        const data = response.data;
        
        if (loadingState) loadingState.classList.add('hidden');
        
        if (data.matches && data.matches.length > 0) {
            renderAIMatchingResults(data.matches);
            if (resultsContainer) resultsContainer.classList.remove('hidden');
        } else {
            const alertText = currentLanguage === 'ko' 
                ? '매칭되는 기업을 찾을 수 없습니다. 다른 조건으로 시도해보세요.'
                : 'لم يتم العثور على شركات مطابقة. جرب شروط أخرى.';
            alert(alertText);
        }
        
    } catch (error) {
        console.error('AI Matching error:', error);
        if (loadingState) loadingState.classList.add('hidden');
        const alertText = currentLanguage === 'ko' 
            ? 'AI 매칭 중 오류가 발생했습니다. 다시 시도해주세요.'
            : 'حدث خطأ أثناء مطابقة AI. يرجى المحاولة مرة أخرى.';
        alert(alertText);
    }
}

function renderAIMatchingResults(matches) {
    const container = document.getElementById('matchingResultsList');
    if (!container) return;
    
    container.innerHTML = matches.map((match, index) => `
        <div class="kabridge-profile-card kabridge-profile-card-matching">
            <div class="profile-card-header">
                <div class="profile-avatar-wrapper">
                    <div class="profile-avatar">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="profile-status-indicator"></div>
                    <div class="profile-rank-badge">
                        #${index + 1}
                    </div>
                </div>
                <div class="profile-basic-info">
                    <h3 class="profile-company-name text-safe">${getMultilingualText(match, 'name')}</h3>
                    <div class="profile-meta">
                        <span class="profile-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${getMultilingualText(match, 'location')}
                        </span>
                        <span class="profile-industry">
                            ${getCountryFlag(match.country)} ${getIndustryName(match.industry)}
                        </span>
                    </div>
                </div>
                <div class="profile-matching-score">
                    <div class="matching-score-circle">
                        <span class="score-number">${match.matching_score || 85}</span>
                        <span class="score-label">
                            <span class="lang-ko">점</span>
                            <span class="lang-ar hidden">نقطة</span>
                        </span>
                    </div>
                    <div class="score-explanation text-safe">
                        ${match.matching_explanation || '높은 매칭도'}
                    </div>
                </div>
            </div>
            
            <div class="profile-card-body">
                <div class="profile-section">
                    <div class="profile-description text-safe line-clamp-3">
                        ${getMultilingualText(match, 'description')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h4 class="profile-section-title">
                        <span class="lang-ko">협력 분야</span>
                        <span class="lang-ar hidden">مجال التعاون</span>
                    </h4>
                    <div class="profile-cooperation text-safe line-clamp-2">
                        ${getMultilingualText(match, 'cooperation_needs')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h4 class="profile-section-title">
                        <i class="fas fa-brain mr-1"></i>
                        <span class="lang-ko">매칭 분석</span>
                        <span class="lang-ar hidden">تحليل المطابقة</span>
                    </h4>
                    <div class="matching-explanation text-safe">
                        ${match.matching_explanation || '산업 분야와 협력 목적이 잘 일치합니다.'}
                    </div>
                </div>
            </div>
            
            <div class="profile-card-footer">
                <div class="profile-tags">
                    <span class="profile-tag">${getIndustryName(match.industry)}</span>
                    <span class="profile-tag profile-tag-matching">
                        <i class="fas fa-percentage mr-1"></i>
                        ${Math.round((match.matching_score || 85))}% 매칭
                    </span>
                </div>
                <div class="profile-action-buttons">
                    <button class="profile-action-btn profile-action-btn-secondary" onclick="openDMModal('${match.id}', '${getMultilingualText(match, 'name').replace(/'/g, "\\'")}')">
                        <i class="fas fa-envelope mr-2"></i>
                        <span class="lang-ko">메시지</span>
                        <span class="lang-ar hidden">رسالة</span>
                    </button>
                    <button class="profile-action-btn">
                        <span class="lang-ko">연결 요청</span>
                        <span class="lang-ar hidden">طلب الاتصال</span>
                        <i class="fas fa-paper-plane ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateLanguageDisplay(currentLanguage);
}

// Community Page
function initializeCommunityPage() {
    setupCategoryFilter();
    setupNewPostModal();
    loadCommunityPosts();
}

function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            categoryBtns.forEach(b => {
                b.classList.remove('kabridge-btn-primary');
                b.classList.add('kabridge-btn-outline');
                b.classList.remove('active');
            });
            
            this.classList.remove('kabridge-btn-outline');
            this.classList.add('kabridge-btn-primary');
            this.classList.add('active');
            
            // Load posts for selected category
            const category = this.getAttribute('data-category');
            loadCommunityPosts(category);
        });
    });
}

async function loadCommunityPosts(category = '') {
    const container = document.getElementById('communityPosts');
    const loading = document.getElementById('postsLoading');
    
    if (loading) loading.classList.remove('hidden');
    if (container) container.innerHTML = '';
    
    try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        params.set('limit', '20');
        
        const response = await axios.get(`/api/posts?${params.toString()}`);
        const data = response.data;
        
        if (loading) loading.classList.add('hidden');
        
        if (data.posts && data.posts.length > 0) {
            renderCommunityPosts(data.posts);
        } else {
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-12 text-gray-500">
                        <i class="fas fa-comments text-4xl mb-4"></i>
                        <p class="lang-ko">게시글이 없습니다.</p>
                        <p class="lang-ar hidden">لا توجد منشورات.</p>
                    </div>
                `;
                updateLanguageDisplay(currentLanguage);
            }
        }
        
    } catch (error) {
        console.error('Error loading community posts:', error);
        if (loading) loading.classList.add('hidden');
    }
}

function renderCommunityPosts(posts) {
    const container = document.getElementById('communityPosts');
    if (!container) return;
    
    container.innerHTML = posts.map(post => `
        <div class="kabridge-card ${post.status === 'featured' ? 'kabridge-card-premium' : ''} p-6">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1 min-w-0">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 text-safe line-clamp-2">
                        ${getMultilingualText(post, 'title')}
                    </h3>
                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                        <span class="flex items-center">
                            <i class="fas fa-user mr-1"></i>
                            ${post.author_name}
                        </span>
                        <span class="flex items-center">
                            <i class="fas fa-building mr-1"></i>
                            ${post.author_company || 'N/A'}
                        </span>
                        <span class="flex items-center">
                            <i class="fas fa-flag mr-1"></i>
                            ${getCountryFlag(post.author_country)} ${getCountryName(post.author_country)}
                        </span>
                        <span class="flex items-center">
                            <i class="fas fa-clock mr-1"></i>
                            ${formatDate(post.created_at)}
                        </span>
                    </div>
                </div>
                <div class="flex flex-col items-end ml-4">
                    ${post.status === 'featured' ? '<span class="badge badge-gold mb-2">추천</span>' : ''}
                    <span class="badge badge-outline">${getCategoryName(post.category)}</span>
                </div>
            </div>
            
            <div class="text-gray-700 line-clamp-3 text-safe">
                ${getMultilingualText(post, 'content')}
            </div>
            
            <div class="flex items-center justify-between mt-4 pt-4 border-t">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                        <i class="fas fa-eye mr-1"></i>
                        ${post.views || 0}
                    </span>
                    <span class="flex items-center">
                        <i class="fas fa-heart mr-1"></i>
                        ${post.likes || 0}
                    </span>
                </div>
                <button class="kabridge-btn kabridge-btn-outline text-sm">
                    <span class="lang-ko">자세히 보기</span>
                    <span class="lang-ar hidden">اقرأ المزيد</span>
                </button>
            </div>
        </div>
    `).join('');
    
    updateLanguageDisplay(currentLanguage);
}

// Matching Requests Page
function initializeRequestsPage() {
    setupRequestForm();
    loadMatchingRequests();
}

function setupRequestForm() {
    const form = document.getElementById('requestForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const requesterName = document.getElementById('requesterName').value.trim();
        const requesterCompany = document.getElementById('requesterCompany').value.trim();
        const requesterCountry = document.getElementById('requesterCountry').value;
        const cooperationPurpose = document.getElementById('cooperationPurpose').value.trim();
        const contactEmail = document.getElementById('contactEmail').value.trim();
        
        if (!requesterName || !requesterCountry || !cooperationPurpose) {
            const alertText = currentLanguage === 'ko' 
                ? '필수 항목을 모두 입력해주세요.'
                : 'يرجى ملء جميع الحقول المطلوبة.';
            alert(alertText);
            return;
        }
        
        try {
            const response = await axios.post('/api/matching-requests', {
                requester_name: requesterName,
                requester_company: requesterCompany,
                requester_country: requesterCountry,
                business_type: 'Partnership',
                cooperation_purpose: cooperationPurpose,
                contact_email: contactEmail,
                priority: 'normal'
            });
            
            if (response.data.success) {
                const successText = currentLanguage === 'ko' 
                    ? '매칭 요청이 성공적으로 등록되었습니다!'
                    : 'تم تسجيل طلب المطابقة بنجاح!';
                alert(successText);
                
                // Clear form
                form.reset();
                
                // Reload requests
                loadMatchingRequests();
            }
            
        } catch (error) {
            console.error('Error creating matching request:', error);
            const errorText = currentLanguage === 'ko' 
                ? '요청 등록 중 오류가 발생했습니다.'
                : 'حدث خطأ أثناء تسجيل الطلب.';
            alert(errorText);
        }
    });
}

async function loadMatchingRequests() {
    const container = document.getElementById('matchingRequestsList');
    if (!container) return;
    
    try {
        const response = await axios.get('/api/matching-requests?limit=10');
        const data = response.data;
        
        if (data.requests && data.requests.length > 0) {
            renderMatchingRequests(data.requests);
        } else {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-handshake text-3xl mb-3"></i>
                    <p class="lang-ko">아직 매칭 요청이 없습니다.</p>
                    <p class="lang-ar hidden">لا توجد طلبات مطابقة بعد.</p>
                </div>
            `;
            updateLanguageDisplay(currentLanguage);
        }
        
    } catch (error) {
        console.error('Error loading matching requests:', error);
    }
}

function renderMatchingRequests(requests) {
    const container = document.getElementById('matchingRequestsList');
    if (!container) return;
    
    container.innerHTML = requests.map(request => `
        <div class="kabridge-card p-4 ${request.priority === 'high' ? 'border-l-4 border-kabridge-gold' : ''}">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 mb-1 text-safe truncate-safe">
                        ${request.requester_name}
                    </h4>
                    <p class="text-sm text-gray-600 text-safe truncate-safe">
                        ${request.requester_company || 'N/A'} • ${getCountryFlag(request.requester_country)} ${getCountryName(request.requester_country)}
                    </p>
                </div>
                <div class="flex flex-col items-end ml-2">
                    ${request.priority === 'high' ? '<span class="badge badge-gold text-xs">긴급</span>' : ''}
                    <span class="text-xs text-gray-500">${formatDate(request.created_at)}</span>
                </div>
            </div>
            
            <p class="text-sm text-gray-700 line-clamp-2 text-safe">
                ${getMultilingualText(request, 'cooperation_purpose')}
            </p>
            
            <div class="flex justify-between items-center mt-3 pt-3 border-t">
                <span class="text-xs text-gray-500">
                    ${request.budget_range || 'N/A'} • ${request.timeline || 'N/A'}
                </span>
                <button class="kabridge-btn kabridge-btn-outline text-xs">
                    <span class="lang-ko">연락하기</span>
                    <span class="lang-ar hidden">اتصل</span>
                </button>
            </div>
        </div>
    `).join('');
    
    updateLanguageDisplay(currentLanguage);
}

// Utility Functions
function getMultilingualText(obj, field) {
    if (currentLanguage === 'ar' && obj[field + '_ar']) {
        return escapeHtml(obj[field + '_ar']);
    } else if (currentLanguage === 'ko' && obj[field]) {
        return escapeHtml(obj[field]);
    } else if (obj[field + '_en']) {
        return escapeHtml(obj[field + '_en']);
    } else if (obj[field]) {
        return escapeHtml(obj[field]);
    }
    return '';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCountryFlag(countryCode) {
    const flags = {
        'KR': '🇰🇷',
        'SA': '🇸🇦', 
        'AE': '🇦🇪',
        'EG': '🇪🇬',
        'JO': '🇯🇴',
        'LB': '🇱🇧',
        'QA': '🇶🇦',
        'BH': '🇧🇭',
        'KW': '🇰🇼',
        'OM': '🇴🇲'
    };
    return flags[countryCode] || '🏢';
}

function getCountryName(countryCode) {
    const names = {
        ko: {
            'KR': '한국', 'SA': '사우디아라비아', 'AE': 'UAE', 'EG': '이집트',
            'JO': '요단', 'LB': '레바논', 'QA': '카타르', 'BH': '바레인',
            'KW': '쿠웨이트', 'OM': '오만'
        },
        ar: {
            'KR': 'كوريا', 'SA': 'السعودية', 'AE': 'الإمارات', 'EG': 'مصر',
            'JO': 'الأردن', 'LB': 'لبنان', 'QA': 'قطر', 'BH': 'البحرين',
            'KW': 'الكويت', 'OM': 'عمان'
        }
    };
    
    return names[currentLanguage]?.[countryCode] || countryCode;
}

function getIndustryName(industry) {
    const industries = {
        ko: {
            'technology': '기술/IT',
            'manufacturing': '제조업',
            'energy': '에너지',
            'healthcare': '헬스케어', 
            'finance': '금융',
            'construction': '건설',
            'food': '식품',
            'logistics': '물류',
            'retail': '소매',
            'education': '교육'
        },
        ar: {
            'technology': 'التكنولوجيا/تقنية المعلومات',
            'manufacturing': 'التصنيع',
            'energy': 'الطاقة',
            'healthcare': 'الرعاية الصحية',
            'finance': 'التمويل',
            'construction': 'البناء',
            'food': 'الأغذية',
            'logistics': 'الخدمات اللوجستية',
            'retail': 'التجارة',
            'education': 'التعليم'
        }
    };
    
    return industries[currentLanguage]?.[industry] || industry;
}

function getCategoryName(category) {
    const categories = {
        ko: {
            'general': '일반',
            'partnership': '파트너십',
            'investment': '투자',
            'technology': '기술',
            'trade': '무역'
        },
        ar: {
            'general': 'عام',
            'partnership': 'شراكة',
            'investment': 'استثمار',
            'technology': 'تكنولوجيا',
            'trade': 'تجارة'
        }
    };
    
    return categories[currentLanguage]?.[category] || category;
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (currentLanguage === 'ar') {
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        return date.toLocaleDateString('ar');
    } else {
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        return date.toLocaleDateString('ko');
    }
}

// New Post Modal Functions
function setupNewPostModal() {
    const newPostBtn = document.getElementById('newPostBtn');
    const newPostModal = document.getElementById('newPostModal');
    const closePostModal = document.getElementById('closePostModal');
    const cancelPost = document.getElementById('cancelPost');
    const newPostForm = document.getElementById('newPostForm');
    
    // Open modal
    if (newPostBtn) {
        newPostBtn.addEventListener('click', function() {
            if (newPostModal) {
                newPostModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Close modal functions
    function closeModal() {
        if (newPostModal) {
            newPostModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            if (newPostForm) newPostForm.reset();
        }
    }
    
    if (closePostModal) {
        closePostModal.addEventListener('click', closeModal);
    }
    
    if (cancelPost) {
        cancelPost.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking backdrop
    if (newPostModal) {
        newPostModal.addEventListener('click', function(e) {
            if (e.target === newPostModal) {
                closeModal();
            }
        });
    }
    
    // Handle form submission
    if (newPostForm) {
        newPostForm.addEventListener('submit', handleNewPostSubmission);
    }
}

async function handleNewPostSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const postData = {
        title: formData.get('title'),
        title_en: formData.get('title_en'),
        title_ar: formData.get('title_ar'),
        content: formData.get('content'),
        content_en: formData.get('content_en'),
        content_ar: formData.get('content_ar'),
        author_name: formData.get('author_name'),
        author_company: formData.get('author_company'),
        author_country: formData.get('author_country'),
        category: formData.get('category')
    };
    
    // Validation
    if (!postData.title || !postData.content || !postData.author_name || !postData.author_country) {
        alert('필수 필드를 모두 입력해주세요.');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>게시 중...';
        submitBtn.disabled = true;
        
        const response = await axios.post('/api/posts', postData);
        
        if (response.data.success) {
            // Success message
            alert('게시글이 성공적으로 작성되었습니다!');
            
            // Close modal
            document.getElementById('newPostModal').classList.add('hidden');
            document.body.style.overflow = 'auto';
            e.target.reset();
            
            // Reload posts
            loadCommunityPosts();
        } else {
            throw new Error(response.data.error || 'Failed to create post');
        }
        
    } catch (error) {
        console.error('Error creating post:', error);
        alert('게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>게시글 작성';
        submitBtn.disabled = false;
    }
}

// Main AI Form Setup
function setupMainAIForm() {
    const mainAIForm = document.getElementById('mainAIForm');
    const mainAIInput = document.getElementById('mainAIInput');
    const suggestionButtons = document.querySelectorAll('.ai-suggestion');
    
    // Set up placeholder text
    function updateAIPlaceholder() {
        if (mainAIInput) {
            const placeholder = currentLanguage === 'ko' 
                ? '어떤 비즈니스 협력을 원하시나요? 자세히 설명해주세요...'
                : 'ما نوع التعاون التجاري الذي تريده؟ يرجى الوصف بالتفصيل...';
            mainAIInput.placeholder = placeholder;
        }
    }
    
    updateAIPlaceholder();
    
    // Handle suggestion button clicks
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const koreanText = this.querySelector('.lang-ko').textContent;
            const arabicText = this.querySelector('.lang-ar').textContent;
            const text = currentLanguage === 'ko' ? koreanText : arabicText;
            
            if (mainAIInput) {
                mainAIInput.value = text;
                mainAIInput.focus();
            }
        });
    });
    
    // Handle form submission
    if (mainAIForm) {
        mainAIForm.addEventListener('submit', handleMainAISubmission);
    }
    
    // Update placeholder when language changes
    document.addEventListener('languageChanged', updateAIPlaceholder);
}

async function handleMainAISubmission(e) {
    e.preventDefault();
    
    const mainAIInput = document.getElementById('mainAIInput');
    const aiResultsSection = document.getElementById('aiResultsSection');
    const aiResultsList = document.getElementById('aiResultsList');
    
    const inputValue = mainAIInput ? mainAIInput.value.trim() : '';
    
    if (!inputValue) {
        const alertText = currentLanguage === 'ko' 
            ? '질문을 입력해주세요.' 
            : 'يرجى إدخال سؤال.';
        alert(alertText);
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-sm"></i>';
        submitBtn.disabled = true;
        
        // Show results section with loading
        if (aiResultsSection) {
            aiResultsSection.classList.remove('hidden');
            aiResultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (aiResultsList) {
            aiResultsList.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="loading-spinner"></div>
                    <p class="text-gray-600 mt-4">
                        <span class="lang-ko">AI가 최적의 파트너를 찾고 있습니다...</span>
                        <span class="lang-ar hidden">الذكاء الاصطناعي يبحث عن أفضل شريك...</span>
                    </p>
                </div>
            `;
            updateLanguageDisplay(currentLanguage);
        }
        
        // Make AI matching request
        const userCountry = currentLanguage === 'ko' ? 'KR' : 'SA';
        const response = await axios.post('/api/ai-matching', {
            cooperation_purpose: inputValue,
            user_country: userCountry
        });
        
        const data = response.data;
        
        if (data.matches && data.matches.length > 0) {
            renderMainAIResults(data.matches);
        } else {
            if (aiResultsList) {
                aiResultsList.innerHTML = `
                    <div class="col-span-full text-center py-12 text-gray-500">
                        <i class="fas fa-search text-4xl mb-4"></i>
                        <p class="lang-ko">매칭되는 기업을 찾을 수 없습니다. 다른 키워드로 시도해보세요.</p>
                        <p class="lang-ar hidden">لم يتم العثور على شركات مطابقة. جرب كلمات مفتاحية أخرى.</p>
                    </div>
                `;
                updateLanguageDisplay(currentLanguage);
            }
        }
        
    } catch (error) {
        console.error('AI Matching error:', error);
        if (aiResultsList) {
            aiResultsList.innerHTML = `
                <div class="col-span-full text-center py-12 text-red-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p class="lang-ko">오류가 발생했습니다. 다시 시도해주세요.</p>
                    <p class="lang-ar hidden">حدث خطأ. يرجى المحاولة مرة أخرى.</p>
                </div>
            `;
            updateLanguageDisplay(currentLanguage);
        }
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane text-sm"></i>';
        submitBtn.disabled = false;
    }
}

function renderMainAIResults(matches) {
    const aiResultsList = document.getElementById('aiResultsList');
    if (!aiResultsList) return;
    
    aiResultsList.innerHTML = matches.map((match, index) => `
        <div class="kabridge-profile-card kabridge-profile-card-matching">
            <div class="profile-card-header">
                <div class="profile-avatar-wrapper">
                    <div class="profile-avatar">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="profile-status-indicator"></div>
                    <div class="profile-rank-badge">
                        #${index + 1}
                    </div>
                </div>
                <div class="profile-basic-info">
                    <h3 class="profile-company-name text-safe">${getMultilingualText(match, 'name')}</h3>
                    <div class="profile-meta">
                        <span class="profile-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${getMultilingualText(match, 'location')}
                        </span>
                        <span class="profile-industry">
                            ${getCountryFlag(match.country)} ${getIndustryName(match.industry)}
                        </span>
                    </div>
                </div>
                <div class="profile-matching-score">
                    <div class="matching-score-circle">
                        <span class="score-number">${match.matching_score || 85}</span>
                        <span class="score-label">
                            <span class="lang-ko">점</span>
                            <span class="lang-ar hidden">نقطة</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="profile-card-body">
                <div class="profile-section">
                    <div class="profile-description text-safe line-clamp-3">
                        ${getMultilingualText(match, 'description')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h4 class="profile-section-title">
                        <span class="lang-ko">협력 분야</span>
                        <span class="lang-ar hidden">مجال التعاون</span>
                    </h4>
                    <div class="profile-cooperation text-safe line-clamp-2">
                        ${getMultilingualText(match, 'cooperation_needs')}
                    </div>
                </div>
            </div>
            
            <div class="profile-card-footer">
                <div class="profile-tags">
                    <span class="profile-tag">${getIndustryName(match.industry)}</span>
                    <span class="profile-tag profile-tag-matching">
                        <i class="fas fa-percentage mr-1"></i>
                        ${Math.round((match.matching_score || 85))}% 매칭
                    </span>
                </div>
                <div class="profile-action-buttons">
                    <button class="profile-action-btn profile-action-btn-secondary" onclick="openDMModal('${match.id}', '${getMultilingualText(match, 'name').replace(/'/g, "\\'")}')">
                        <i class="fas fa-envelope mr-2"></i>
                        <span class="lang-ko">메시지</span>
                        <span class="lang-ar hidden">رسالة</span>
                    </button>
                    <button class="profile-action-btn">
                        <span class="lang-ko">연결 요청</span>
                        <span class="lang-ar hidden">طلب الاتصال</span>
                        <i class="fas fa-paper-plane ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateLanguageDisplay(currentLanguage);
}
// DM Modal Functions
function openDMModal(companyId, companyName) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('dmModal');
    if (!modal) {
        createDMModal();
        modal = document.getElementById('dmModal');
    }
    
    // Set company info
    const modalCompanyName = document.getElementById('dmModalCompanyName');
    const dmCompanyIdInput = document.getElementById('dmCompanyId');
    
    if (modalCompanyName) {
        modalCompanyName.textContent = companyName;
    }
    if (dmCompanyIdInput) {
        dmCompanyIdInput.value = companyId;
    }
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus on message textarea
    const messageTextarea = document.getElementById('dmMessage');
    if (messageTextarea) {
        setTimeout(() => messageTextarea.focus(), 100);
    }
}

function createDMModal() {
    const modalHTML = `
        <div id="dmModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div class="border-b border-gray-200 px-6 py-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900">
                            <i class="fas fa-envelope text-kabridge-blue mr-2"></i>
                            <span class="lang-ko">메시지 보내기</span>
                            <span class="lang-ar hidden">إرسال رسالة</span>
                        </h3>
                        <button onclick="closeDMModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                        <span class="lang-ko">수신자:</span>
                        <span class="lang-ar hidden">المستقبل:</span>
                        <span id="dmModalCompanyName" class="font-medium text-gray-900"></span>
                    </p>
                </div>
                
                <form id="dmForm" class="p-6">
                    <input type="hidden" id="dmCompanyId" name="company_id">
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                <span class="lang-ko">제목</span>
                                <span class="lang-ar hidden">الموضوع</span>
                            </label>
                            <input type="text" id="dmSubject" name="subject" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                   placeholder="">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                <span class="lang-ko">메시지</span>
                                <span class="lang-ar hidden">الرسالة</span>
                            </label>
                            <textarea id="dmMessage" name="message" required rows="4"
                                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                      placeholder=""></textarea>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <span class="lang-ko">보낸 사람</span>
                                    <span class="lang-ar hidden">المرسل</span>
                                </label>
                                <input type="text" id="dmSenderName" name="sender_name" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                       placeholder="">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <span class="lang-ko">이메일</span>
                                    <span class="lang-ar hidden">البريد الإلكتروني</span>
                                </label>
                                <input type="email" id="dmSenderEmail" name="sender_email" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kabridge-blue"
                                       placeholder="">
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 mt-6">
                        <button type="button" onclick="closeDMModal()" class="kabridge-btn kabridge-btn-outline">
                            <span class="lang-ko">취소</span>
                            <span class="lang-ar hidden">إلغاء</span>
                        </button>
                        <button type="submit" class="kabridge-btn kabridge-btn-primary">
                            <i class="fas fa-paper-plane mr-2"></i>
                            <span class="lang-ko">메시지 전송</span>
                            <span class="lang-ar hidden">إرسال الرسالة</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const dmForm = document.getElementById('dmForm');
    if (dmForm) {
        dmForm.addEventListener('submit', handleDMSubmission);
    }
    
    // Update placeholders based on current language
    updateDMPlaceholders();
}

function closeDMModal() {
    const modal = document.getElementById('dmModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('dmForm');
        if (form) form.reset();
    }
}

function updateDMPlaceholders() {
    const subjectInput = document.getElementById('dmSubject');
    const messageTextarea = document.getElementById('dmMessage');
    const senderNameInput = document.getElementById('dmSenderName');
    const senderEmailInput = document.getElementById('dmSenderEmail');
    
    if (currentLanguage === 'ko') {
        if (subjectInput) subjectInput.placeholder = '협력 제안 또는 문의사항';
        if (messageTextarea) messageTextarea.placeholder = '안녕하세요. 귀하의 회사와 비즈니스 협력에 대해 논의하고 싶습니다...';
        if (senderNameInput) senderNameInput.placeholder = '홍길동';
        if (senderEmailInput) senderEmailInput.placeholder = 'hong@company.co.kr';
    } else {
        if (subjectInput) subjectInput.placeholder = 'اقتراح تعاون أو استفسار';
        if (messageTextarea) messageTextarea.placeholder = 'مرحبا. أود مناقشة التعاون التجاري مع شركتكم...';
        if (senderNameInput) senderNameInput.placeholder = 'أحمد محمد';
        if (senderEmailInput) senderEmailInput.placeholder = 'ahmed@company.com';
    }
}

async function handleDMSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dmData = {
        company_id: formData.get('company_id'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        sender_name: formData.get('sender_name'),
        sender_email: formData.get('sender_email')
    };
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span class="lang-ko">전송 중...</span><span class="lang-ar hidden">جاري الإرسال...</span>';
        submitBtn.disabled = true;
        
        // Simulate API call (for now just show success)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success message
        const successText = currentLanguage === 'ko' 
            ? '메시지가 성공적으로 전송되었습니다!'
            : 'تم إرسال الرسالة بنجاح!';
        alert(successText);
        
        // Close modal
        closeDMModal();
        
    } catch (error) {
        console.error('Error sending DM:', error);
        const errorText = currentLanguage === 'ko' 
            ? '메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.'
            : 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.';
        alert(errorText);
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i><span class="lang-ko">메시지 전송</span><span class="lang-ar hidden">إرسال الرسالة</span>';
        submitBtn.disabled = false;
    }
}

// Update DM placeholders when language changes
document.addEventListener('languageChanged', function() {
    updateDMPlaceholders();
});
