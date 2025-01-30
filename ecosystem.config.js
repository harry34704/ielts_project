module.exports = {
  apps: [
    {
      name: 'ielts-practice-api',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-production-host',
      ref: 'origin/main',
      repo: 'git@github.com:username/repo.git',
      path: '/var/www/production',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
    },
    staging: {
      user: 'ubuntu',
      host: 'your-staging-host',
      ref: 'origin/develop',
      repo: 'git@github.com:username/repo.git',
      path: '/var/www/staging',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env staging',
    },
  },
}; 