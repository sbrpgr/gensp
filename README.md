# KABridge - 한국-아랍 비즈니스 매칭 플랫폼

## 🌟 프로젝트 개요

**KABridge**는 한국과 아랍 국가 간의 비즈니스 매칭을 위한 AI 기반 플랫폼입니다.

### 주요 기능
- 🤖 **AI 기반 기업 매칭**: 고도화된 알고리즘으로 최적의 비즈니스 파트너 추천
- 🏢 **600개 합성 샘플 기업 데이터베이스**: 한국 300개 + 아랍 300개 기업 정보
- 💬 **커뮤니티 시스템**: 비즈니스 경험 및 기회 공유
- 🌍 **다국어 지원**: 한국어 ↔ 아랍어 실시간 언어 전환
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험

## 🚀 라이브 데모

- **프로덕션**: https://kabridge.pages.dev (배포 후 업데이트)
- **개발 서버**: https://3000-i2c8mmk5tzikgibsyx0e8-6532622b.e2b.dev
- **GitHub**: https://github.com/sbrpgr/gensp

## 🏗️ 기술 스택

### Frontend
- **Framework**: Hono (경량 웹 프레임워크)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **JavaScript**: Vanilla JS (ES6+)

### Backend & Infrastructure  
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Vite
- **Process Manager**: PM2
- **Version Control**: Git

## 📊 데이터 구조

### 기업 정보 (Companies)
```sql
- id: 고유 식별자
- name: 기업명 (한국어)
- name_en: 기업명 (영어) 
- name_ar: 기업명 (아랍어)
- country: 국가 코드 (KR/SA/AE/etc)
- industry: 산업 분야
- location: 소재지
- description: 기업 소개
- cooperation_needs: 협력 요구사항
- created_at: 등록일시
```

### 커뮤니티 게시글 (Posts)
```sql
- id: 고유 식별자
- title: 제목 (다국어)
- content: 내용 (다국어)  
- author: 작성자
- category: 카테고리
- created_at: 작성일시
```

## 🛠️ 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/sbrpgr/gensp.git
cd gensp
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 설정
```bash
# wrangler.toml 파일에서 데이터베이스 ID 업데이트
# D1 데이터베이스 생성
npx wrangler d1 create kabridge-production

# 마이그레이션 실행
npx wrangler d1 migrations apply kabridge-production --local

# 샘플 데이터 초기화 (로컬)
npm run db:seed # 로컬 D1에만 샘플 적재
```

### 4. 개발 서버 실행
```bash
# 빌드
npm run build

# 개발 서버 시작 (PM2)
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:d1
```

## 🚀 배포 가이드

### GitHub Actions 자동 배포 (권장)

1. **Cloudflare API 토큰 설정**:
   - Cloudflare 대시보드 → API 토큰 → 사용자 지정 토큰 생성
   - 권한: `Cloudflare Pages:Edit`, `Account:Read`, `Zone:Read`

2. **GitHub Secrets 설정**:
   ```
   CLOUDFLARE_API_TOKEN: [생성한 API 토큰]
   CLOUDFLARE_ACCOUNT_ID: [Cloudflare 계정 ID] 
   ```

3. **자동 배포**:
   - `main` 브랜치에 푸시하면 자동으로 배포됨
   - GitHub Actions 워크플로우가 빌드 및 배포 자동 실행

### 수동 배포

```bash
# 빌드
npm run build

# Cloudflare Pages에 배포
npm run deploy

# 또는 직접 wrangler 사용
npx wrangler pages deploy dist --project-name kabridge
```

### 프로덕션 데이터베이스 설정

```bash
# 프로덕션 D1 데이터베이스 생성
npx wrangler d1 create kabridge-production

# wrangler.toml 파일의 database_id 업데이트

# 프로덕션 마이그레이션 실행
npx wrangler d1 migrations apply kabridge-production

# 프로덕션 데이터 초기화
# 운영 샘플 적재는 권한을 가진 운영자가 Wrangler CLI로 별도 수행
```

## 📁 프로젝트 구조

```
kabridge/
├── src/
│   ├── index.tsx              # 메인 애플리케이션 (백엔드 + 프론트엔드)
│   └── renderer.tsx           # SSR 렌더링 유틸리티
├── public/
│   └── static/
│       ├── app.js             # 프론트엔드 JavaScript
│       ├── styles.css         # 스타일시트
│       ├── kabridge-logo.svg  # 로고
│       └── ...               # 기타 정적 파일
├── migrations/
│   ├── 0001_simple_company_schema.sql  # 기업 테이블 스키마
│   └── 0002_community_system.sql       # 커뮤니티 테이블 스키마  
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions 배포 워크플로우
├── dist/                      # 빌드 출력 (자동 생성)
├── wrangler.toml             # Cloudflare 설정
├── package.json              # 의존성 및 스크립트
├── ecosystem.config.cjs      # PM2 설정
└── README.md                 # 이 파일
```

## 🌐 API 엔드포인트

### 기업 관련
- `GET /api/companies` - 기업 목록 조회
- `POST /api/companies` - 신규 기업 등록  
- `GET /api/companies/:id` - 특정 기업 상세 정보

### 커뮤니티
- `GET /api/posts` - 커뮤니티 게시글 목록
- `POST /api/posts` - 새 게시글 작성
- `GET /api/posts/:id` - 특정 게시글 조회

### AI 매칭
- `POST /api/ai-match` - AI 기반 기업 매칭

### 유틸리티
- `POST /api/init-data`, `POST /api/bulk-insert` - HTTP 접근 차단(403); 초기화는 운영자 CLI로만 수행

## 🎯 현재 구현 상태

### ✅ 완료된 기능
- [x] AI 중심 홈페이지 인터페이스
- [x] 600개 합성 샘플 기업 데이터베이스 (한국 300개 + 아랍 300개)
- [x] 프로파일 카드 형태 기업 정보 표시
- [x] 다국어 지원 (한국어 ↔ 아랍어)
- [x] 커뮤니티 시스템 (게시글 작성/조회)
- [x] DM (다이렉트 메시지) 기능
- [x] AI 기반 기업 매칭 알고리즘
- [x] 반응형 디자인
- [x] GitHub Actions 자동 배포
- [x] D1 데이터베이스 연동

### 🔄 개발 중
- [ ] 실제 이메일/SMS 알림 시스템
- [ ] 사용자 인증 시스템
- [ ] 고급 검색 필터
- [ ] 매칭 요청 관리 시스템

## 📞 다음 단계

1. **프로덕션 배포**: GitHub Actions를 통한 Cloudflare Pages 배포
2. **도메인 연결**: 커스텀 도메인 설정 (선택사항)
3. **모니터링**: 사용자 분석 및 성능 모니터링 설정
4. **기능 확장**: 추가 기능 개발 및 사용자 피드백 반영

## 🤝 기여 방법

1. Fork 저장소
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**KABridge** - 한국과 아랍 세계를 연결하는 비즈니스 플랫폼 🌉
## 보안 검증

`npm run test:security`는 배포 번들을 빌드한 뒤, 관리용 초기화 API의 비인가 POST 요청이 DB에 접근하기 전에 거부되는지 검증합니다. `setup:prod`는 스키마 마이그레이션만 실행하며 공개 HTTP 초기화 호출은 제거했습니다.
