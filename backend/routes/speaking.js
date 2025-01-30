const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const speakingController = require('../controllers/speakingController');

router.post('/analyze', upload.single('audio'), speakingController.analyzeSpeaking);
router.get('/tasks', speakingController.getSpeakingTasks);
router.post('/save-result', speakingController.saveSpeakingResult);
router.get('/progress', speakingController.getSpeakingProgress);

module.exports = router; 