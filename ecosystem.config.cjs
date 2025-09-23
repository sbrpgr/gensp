// PM2 ecosystem configuration for KABridge platform
module.exports = {
  apps: [
    {
      name: 'kabridge',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=kabridge-production --local --ip 0.0.0.0 --port 3000 --compatibility-date 2024-01-01',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        FORCE_COLOR: '1'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 100, // 증가
      min_uptime: '5s',
      max_memory_restart: '1G', // 증가
      restart_delay: 1000, // 재시작 지연
      kill_timeout: 5000,
      listen_timeout: 10000,
      exp_backoff_restart_delay: 100
    }
  ]
}