const express = require('express');
const router = express.Router();
const writingController = require('../controllers/writingController');

router.post('/analyze', writingController.analyzeWriting);
router.get('/tasks', writingController.getWritingTasks);
router.post('/save-result', writingController.saveWritingResult);
router.get('/progress', writingController.getWritingProgress);

module.exports = router; 