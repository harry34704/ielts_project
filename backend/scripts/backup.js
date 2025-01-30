const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

const BACKUP_DIR = path.join(__dirname, '../backups');
const MONGODB_URI = process.env.MONGODB_URI;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const backup = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  
  const cmd = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;
  
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Backup error: ${error}`);
      return;
    }
    logger.info(`Backup completed successfully at ${backupPath}`);
    
    // Clean old backups (keep last 7 days)
    cleanOldBackups();
  });
};

const cleanOldBackups = () => {
  const files = fs.readdirSync(BACKUP_DIR);
  const now = new Date();
  
  files.forEach(file => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const days = (now - stats.mtime) / (1000 * 60 * 60 * 24);
    
    if (days > 7) {
      fs.rmSync(filePath, { recursive: true });
      logger.info(`Removed old backup: ${file}`);
    }
  });
};

// Run backup
backup();

// Schedule daily backup
if (require.main === module) {
  const CronJob = require('cron').CronJob;
  new CronJob('0 0 * * *', backup, null, true); // Run at midnight
} 