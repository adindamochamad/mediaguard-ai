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
    },
  ],
};
