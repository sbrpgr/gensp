# KABridge 배포 가이드

## 🚀 완전 자동화된 GitHub → Cloudflare Pages 배포

### 📋 준비사항

#### 1. Cloudflare 계정 설정
1. [Cloudflare 대시보드](https://dash.cloudflare.com) 로그인
2. **계정 ID 확인**: 오른쪽 사이드바에서 확인
3. **API 토큰 생성**: 
   - 프로필 → API 토큰 → 사용자 지정 토큰 생성
   - 권한: `Cloudflare Pages:Edit`, `Account:Read`, `Zone:Read`
   - 생성된 토큰 복사 및 저장

#### 2. GitHub Secrets 설정
GitHub 저장소 → Settings → Secrets and variables → Actions에서 추가:

```
CLOUDFLARE_API_TOKEN: [생성한 API 토큰]
CLOUDFLARE_ACCOUNT_ID: [Cloudflare 계정 ID]
```

### 🔄 자동 배포 프로세스

#### 배포 트리거
- `main` 브랜치에 푸시할 때마다 자동 실행
- GitHub Actions 탭에서 수동 실행 가능

#### 배포 단계
1. **코드 체크아웃** → **Node.js 설정** → **의존성 설치**
2. **애플리케이션 빌드** (`npm run build`)
3. **Cloudflare Pages 배포** (`dist` 폴더)
4. **배포 완료 알림**

### 📝 수동 배포 (대안)

로컬 환경에서 직접 배포하는 경우:

```bash
# 1. Cloudflare 인증
export CLOUDFLARE_API_TOKEN="your-api-token"

# 2. 빌드 및 배포
npm run deploy:prod

# 3. 프로덕션 데이터베이스 설정
npm run db:migrate:prod

# 4. 샘플 데이터 초기화
curl -X POST https://kabridge.pages.dev/api/init-data
```

### 🗄️ 데이터베이스 설정

#### 프로덕션 D1 데이터베이스 생성
```bash
# 1. D1 데이터베이스 생성
npx wrangler d1 create kabridge-production

# 2. 출력된 database_id를 wrangler.toml에 업데이트
# 3. 마이그레이션 실행
npx wrangler d1 migrations apply kabridge-production

# 4. 데이터 초기화
curl -X POST https://your-domain.pages.dev/api/init-data
```

### 🌐 배포 후 확인사항

#### 1. 사이트 접속 테스트
- 기본 URL: `https://kabridge.pages.dev`
- 모든 페이지 정상 로드 확인

#### 2. 데이터 확인
- 기업 목록: 600개 (한국 300개 + 아랍 300개)
- 커뮤니티 게시글: 5개
- AI 매칭 기능 테스트

#### 3. 기능 테스트
- [ ] 언어 전환 (한국어 ↔ 아랍어)
- [ ] 기업 검색 및 필터링
- [ ] AI 매칭 요청
- [ ] 커뮤니티 글 작성/조회
- [ ] DM 기능

### 🔧 문제 해결

#### 배포 실패 시
1. **GitHub Actions 로그 확인**
2. **API 토큰 권한 재확인**
3. **wrangler.toml 설정 검토**

#### 데이터베이스 오류 시
```bash
# 로컬에서 마이그레이션 상태 확인
npx wrangler d1 migrations list kabridge-production

# 프로덕션 데이터베이스 콘솔 접속
npx wrangler d1 execute kabridge-production --command="SELECT COUNT(*) FROM companies"
```

### 📊 모니터링

#### Cloudflare Analytics
- 대시보드에서 트래픽, 성능 지표 확인
- 오류율 및 응답 시간 모니터링

#### 로그 확인
```bash
# 로컬 개발 로그
pm2 logs kabridge --nostream

# Wrangler 로그  
npx wrangler pages deployment tail
```

### 🔄 지속적 배포 (CI/CD)

#### 브랜치 전략
- `main`: 프로덕션 배포
- `develop`: 개발/테스트 (추가 설정 시)

#### 배포 주기
- 기능 개발 완료 시 `main`에 머지
- 자동으로 프로덕션 배포 실행
- 약 2-3분 내 배포 완료

### 🎯 고급 설정

#### 커스텀 도메인 연결
```bash
# 도메인 추가
npx wrangler pages domain add your-domain.com --project-name kabridge

# DNS 설정 확인
npx wrangler pages domain list --project-name kabridge
```

#### 환경 변수 설정
```bash
# 프로덕션 환경 변수 추가
npx wrangler pages secret put API_KEY --project-name kabridge

# 환경 변수 목록 확인  
npx wrangler pages secret list --project-name kabridge
```

---

## 🎉 배포 완료!

배포가 성공적으로 완료되면:
1. **프로덕션 URL**: `https://kabridge.pages.dev`
2. **24/7 안정적 서비스** 제공
3. **글로벌 CDN**을 통한 빠른 접속
4. **자동 SSL 인증서** 적용
5. **무제한 트래픽** 지원

모든 단계가 완료되면 **완전히 안정적인 목업 사이트**가 준비됩니다!