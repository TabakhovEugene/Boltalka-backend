const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', protect, userController.getCurrentUser);
router.put('/me', protect, userController.updateUser);
router.delete('/me', protect, userController.deleteUser);

module.exports = router;
