const express = require('express');
const router = express.Router();
const { generateDescription, smartSearch, chatbotQuery } = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

router.post('/generate-description', protect, isAdmin, generateDescription);
router.post('/smart-search', smartSearch);
router.post('/chatbot', protect, chatbotQuery);

module.exports = router;