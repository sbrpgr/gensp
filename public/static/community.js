// KABridge 커뮤니티 JavaScript

// Global variables
let currentPage = 1;
let currentCategory = 'all';
let posts = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    if (path === '/community') {
        initializeCommunityPage();
    } else if (path.startsWith('/community/post/')) {
        const postId = path.split('/').pop();
        initializePostDetailPage(postId);
    } else if (path === '/community/new') {
        initializeNewPostPage();
    }
});

// Community main page initialization
function initializeCommunityPage() {
    loadPosts();
    setupCategoryFilters();
    setupLoadMoreButton();
}

// Load posts from API
async function loadPosts(page = 1, category = 'all', append = false) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '10'
        });
        
        if (category !== 'all') {
            params.append('category', category);
        }
        
        const response = await fetch(`/api/community/posts?${params}`);
        if (!response.ok) throw new Error('Failed to load posts');
        
        const data = await response.json();
        
        if (append) {
            posts = [...posts, ...data.posts];
        } else {
            posts = data.posts;
        }
        
        renderPosts(posts);
        updateCategoryCounts();
        
        // Show/hide load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (data.hasMore) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }
        
        currentPage = page;
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
}

// Render posts to DOM
function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-comments text-4xl mb-4"></i>
                <p>등록된 게시글이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-4">
                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        ${getCategoryName(post.category)}
                    </span>
                    <span class="text-sm text-gray-500">
                        ${formatDate(post.created_at)}
                    </span>
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span><i class="fas fa-eye mr-1"></i>${post.views || 0}</span>
                    <span><i class="fas fa-thumbs-up mr-1"></i>${post.likes_count || 0}</span>
                    <span><i class="fas fa-comment mr-1"></i>${post.comments_count || 0}</span>
                </div>
            </div>
            
            <h3 class="text-xl font-semibold mb-2">
                <a href="/community/post/${post.id}" class="text-gray-900 hover:text-blue-600">
                    ${escapeHtml(post.title)}
                </a>
            </h3>
            
            <p class="text-gray-600 mb-4 line-clamp-2">
                ${escapeHtml(post.content.substring(0, 200))}${post.content.length > 200 ? '...' : ''}
            </p>
            
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">
                    작성자: ${escapeHtml(post.author)}
                </span>
                <a href="/community/post/${post.id}" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    자세히 보기 →
                </a>
            </div>
        </div>
    `).join('');
}

// Setup category filters
function setupCategoryFilters() {
    const filters = document.querySelectorAll('.category-filter');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active state
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Load posts for selected category
            currentCategory = category;
            currentPage = 1;
            loadPosts(1, category);
        });
    });
}

// Setup load more button
function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    loadMoreBtn.addEventListener('click', function() {
        loadPosts(currentPage + 1, currentCategory, true);
    });
}

// Update category counts
async function updateCategoryCounts() {
    try {
        const response = await fetch('/api/community/posts?count_only=true');
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Update counts in DOM
        Object.keys(data.counts || {}).forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                countElement.textContent = data.counts[category];
            }
        });
        
    } catch (error) {
        console.error('Error updating counts:', error);
    }
}

// Post detail page initialization
function initializePostDetailPage(postId) {
    loadPostDetail(postId);
    setupCommentForm(postId);
}

// Load post detail
async function loadPostDetail(postId) {
    try {
        const response = await fetch(`/api/community/posts/${postId}`);
        if (!response.ok) throw new Error('Failed to load post');
        
        const data = await response.json();
        renderPostDetail(data.post);
        renderComments(data.comments);
        
    } catch (error) {
        console.error('Error loading post:', error);
        showError('게시글을 불러오는 중 오류가 발생했습니다.');
    }
}

// Render post detail
function renderPostDetail(post) {
    const container = document.getElementById('post-container');
    
    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        ${getCategoryName(post.category)}
                    </span>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span><i class="fas fa-eye mr-1"></i>${post.views || 0}</span>
                        <span><i class="fas fa-thumbs-up mr-1"></i>${post.likes_count || 0}</span>
                    </div>
                </div>
                
                <h1 class="text-3xl font-bold text-gray-900 mb-2">${escapeHtml(post.title)}</h1>
                
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>작성자: ${escapeHtml(post.author)}</span>
                    <span>${formatDate(post.created_at)}</span>
                </div>
            </div>
            
            <div class="prose max-w-none mb-6">
                <div class="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    ${escapeHtml(post.content)}
                </div>
            </div>
            
            <div class="flex items-center justify-between pt-6 border-t">
                <button 
                    id="like-btn" 
                    class="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 ${post.user_liked ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-gray-600'}"
                    onclick="toggleLike(${post.id})"
                >
                    <i class="fas fa-thumbs-up"></i>
                    <span>좋아요 (<span id="like-count">${post.likes_count || 0}</span>)</span>
                </button>
                
                <div class="flex space-x-2">
                    <button class="text-gray-600 hover:text-gray-800">
                        <i class="fas fa-share-alt mr-1"></i>공유
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render comments
function renderComments(comments) {
    const container = document.getElementById('comments-container');
    
    if (comments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-comment text-2xl mb-2"></i>
                <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = comments.map(comment => `
        <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900">${escapeHtml(comment.author)}</span>
                <span class="text-sm text-gray-500">${formatDate(comment.created_at)}</span>
            </div>
            <p class="text-gray-700 whitespace-pre-wrap">${escapeHtml(comment.content)}</p>
        </div>
    `).join('');
}

// Setup comment form
function setupCommentForm(postId) {
    const form = document.getElementById('comment-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const author = document.getElementById('comment-author').value.trim();
        const content = document.getElementById('comment-content').value.trim();
        
        if (!author || !content) {
            showError('작성자와 댓글 내용을 모두 입력해주세요.');
            return;
        }
        
        try {
            const response = await fetch(`/api/community/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ author, content })
            });
            
            if (!response.ok) throw new Error('Failed to create comment');
            
            // Clear form
            document.getElementById('comment-author').value = '';
            document.getElementById('comment-content').value = '';
            
            // Reload comments
            loadPostDetail(postId);
            
            showSuccess('댓글이 성공적으로 작성되었습니다.');
            
        } catch (error) {
            console.error('Error creating comment:', error);
            showError('댓글 작성 중 오류가 발생했습니다.');
        }
    });
}

// New post page initialization
function initializeNewPostPage() {
    setupNewPostForm();
}

// Setup new post form
function setupNewPostForm() {
    const form = document.getElementById('post-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const category = document.getElementById('post-category').value;
        const author = document.getElementById('post-author').value.trim();
        const title = document.getElementById('post-title').value.trim();
        const content = document.getElementById('post-content').value.trim();
        
        if (!category || !author || !title || !content) {
            showError('모든 필드를 입력해주세요.');
            return;
        }
        
        try {
            const response = await fetch('/api/community/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category, author, title, content })
            });
            
            if (!response.ok) throw new Error('Failed to create post');
            
            const data = await response.json();
            
            showSuccess('게시글이 성공적으로 작성되었습니다.');
            
            // Redirect to new post
            setTimeout(() => {
                window.location.href = `/community/post/${data.id}`;
            }, 1000);
            
        } catch (error) {
            console.error('Error creating post:', error);
            showError('게시글 작성 중 오류가 발생했습니다.');
        }
    });
}

// Toggle like for post
async function toggleLike(postId) {
    try {
        const response = await fetch(`/api/community/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to toggle like');
        
        const data = await response.json();
        
        // Update UI
        const likeBtn = document.getElementById('like-btn');
        const likeCount = document.getElementById('like-count');
        
        likeCount.textContent = data.likes_count;
        
        if (data.liked) {
            likeBtn.classList.add('text-blue-600', 'border-blue-200', 'bg-blue-50');
            likeBtn.classList.remove('text-gray-600');
        } else {
            likeBtn.classList.remove('text-blue-600', 'border-blue-200', 'bg-blue-50');
            likeBtn.classList.add('text-gray-600');
        }
        
    } catch (error) {
        console.error('Error toggling like:', error);
        showError('좋아요 처리 중 오류가 발생했습니다.');
    }
}

// Utility functions
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}