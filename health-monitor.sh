#!/bin/bash
# KABridge 헬스 모니터링 및 자동 복구 스크립트

SERVICE_URL="https://3000-i2c8mmk5tzikgibsyx0e8-6532622b.e2b.dev"
LOG_FILE="/home/user/webapp/health.log"
MAX_RETRIES=3

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

check_service() {
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL" --max-time 30)
    echo "$response_code"
}

restart_service() {
    log_message "서비스 재시작 중..."
    cd /home/user/webapp
    
    # 포트 정리
    fuser -k 3000/tcp 2>/dev/null || true
    sleep 2
    
    # PM2 재시작
    pm2 restart kabridge
    sleep 10
    
    log_message "서비스 재시작 완료"
}

# 메인 헬스체크 루프
for i in $(seq 1 $MAX_RETRIES); do
    log_message "헬스체크 시도 $i/$MAX_RETRIES"
    
    response_code=$(check_service)
    
    if [ "$response_code" = "200" ]; then
        log_message "✅ 서비스 정상 (HTTP $response_code)"
        exit 0
    else
        log_message "❌ 서비스 이상 (HTTP $response_code)"
        
        if [ $i -lt $MAX_RETRIES ]; then
            sleep 5
        else
            log_message "최대 재시도 횟수 초과. 서비스 재시작 실행..."
            restart_service
        fi
    fi
done