const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverview);
router.get('/progress', analyticsController.getProgress);
router.post('/generate-plan', analyticsController.generateStudyPlan);
router.get('/insights', analyticsController.getInsights);

module.exports = router; 