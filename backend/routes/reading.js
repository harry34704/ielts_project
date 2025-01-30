const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const readingController = require('../controllers/readingController');

router.post('/analyze', upload.single('audio'), readingController.analyzeReading);
router.get('/tasks', readingController.getReadingTasks);
router.post('/save-result', readingController.saveReadingResult);
router.get('/progress', readingController.getReadingProgress);

module.exports = router; 