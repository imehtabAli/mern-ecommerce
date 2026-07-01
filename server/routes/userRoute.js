const express = require("express");
const router = express.Router();
const {getProfile, updateProfile, makeAdmin} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.get('/profile', protect, getProfile);
router.put('/update-profile', protect, updateProfile);
router.put('/:id/make-admin', protect, isAdmin, makeAdmin);
module.exports = router;