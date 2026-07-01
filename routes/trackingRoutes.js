// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

router.get('/', trackingController.getHomePage);
router.get('/track/:busId', trackingController.getTrackingPage);

module.exports = router;