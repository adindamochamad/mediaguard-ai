// PM2 config untuk VPS deployment
// Jalankan: pm2 start ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: 'mediguard-ai',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      env_production: {
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',

      // Crash loop protection — berhenti restart setelah 10x crash berturut-turut
      max_restarts: 10,
      // Tunggu 5 detik antar restart agar tidak spin loop saat ada crash awal
      restart_delay: 5000,

      // Log timestamps agar mudah debug via: pm2 logs mediguard-ai
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
