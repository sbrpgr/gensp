// PM2 ecosystem configuration for KABridge platform
module.exports = {
  apps: [
    {
      name: 'kabridge',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=kabridge-production --local --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Disable PM2 file monitoring (wrangler handles hot reload)
      instances: 1, // Development mode uses only one instance
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '512M'
    }
  ]
}