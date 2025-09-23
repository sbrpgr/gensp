import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KABridge - 한국-아랍 기업 매칭 플랫폼</title>
        <meta name="description" content="한국과 아랍 지역 기업들을 연결하는 혁신적인 비즈니스 매칭 플랫폼" />
        
        {/* Premium Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Tailwind CSS with Custom Config */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    'sans': ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
                    'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
                    'serif': ['Playfair Display', 'serif'],
                    'korean': ['Noto Sans KR', 'Inter', 'system-ui', 'sans-serif']
                  },
                  colors: {
                    primary: {
                      50: '#eff6ff',
                      100: '#dbeafe', 
                      200: '#bfdbfe',
                      300: '#93c5fd',
                      400: '#60a5fa',
                      500: '#3b82f6',
                      600: '#2563eb',
                      700: '#1d4ed8',
                      800: '#1e40af',
                      900: '#1e3a8a',
                      950: '#172554'
                    },
                    secondary: {
                      50: '#fdf4ff',
                      100: '#fae8ff',
                      200: '#f5d0fe', 
                      300: '#f0abfc',
                      400: '#e879f9',
                      500: '#d946ef',
                      600: '#c026d3',
                      700: '#a21caf',
                      800: '#86198f',
                      900: '#701a75',
                      950: '#4a044e'
                    },
                    accent: {
                      50: '#fff7ed',
                      100: '#ffedd5',
                      200: '#fed7aa',
                      300: '#fdba74', 
                      400: '#fb923c',
                      500: '#f97316',
                      600: '#ea580c',
                      700: '#c2410c',
                      800: '#9a3412',
                      900: '#7c2d12',
                      950: '#431407'
                    },
                    success: {
                      50: '#f0fdf4',
                      100: '#dcfce7',
                      200: '#bbf7d0',
                      300: '#86efac', 
                      400: '#4ade80',
                      500: '#22c55e',
                      600: '#16a34a',
                      700: '#15803d',
                      800: '#166534',
                      900: '#14532d',
                      950: '#052e16'
                    }
                  },
                  animation: {
                    'fade-in': 'fadeIn 0.5s ease-out',
                    'slide-up': 'slideUp 0.3s ease-out',
                    'scale-in': 'scaleIn 0.2s ease-out',
                    'float': 'float 3s ease-in-out infinite'
                  },
                  keyframes: {
                    fadeIn: {
                      '0%': { opacity: '0' },
                      '100%': { opacity: '1' }
                    },
                    slideUp: {
                      '0%': { transform: 'translateY(10px)', opacity: '0' },
                      '100%': { transform: 'translateY(0)', opacity: '1' }
                    },
                    scaleIn: {
                      '0%': { transform: 'scale(0.95)', opacity: '0' },
                      '100%': { transform: 'scale(1)', opacity: '1' }
                    },
                    float: {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-5px)' }
                    }
                  },
                  boxShadow: {
                    'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                    'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
                    'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)',
                    'glow': '0 0 20px rgba(59, 130, 246, 0.15)'
                  }
                }
              }
            }
          `
        }} />
        
        {/* Premium Icons */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* Custom Premium Styles */}
        <link href="/static/premium-colors.css" rel="stylesheet" />
        <link href="/static/premium-styles.css" rel="stylesheet" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌉</text></svg>" />
      </head>
      <body className="antialiased font-sans bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {children}
        
        {/* Premium Libraries */}
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"></script>
        
        {/* Custom JavaScript */}
        <script src="/static/i18n.js"></script>
        <script src="/static/premium-app.js"></script>
        <script src="/static/community.js"></script>
      </body>
    </html>
  )
})
