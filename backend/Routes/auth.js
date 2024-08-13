const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  registerUser,
  authUser,
  getUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  changeUserPassword,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getUserProfile); // Use protect middleware here



router.get('/users', getAllUsers);
router.put('/users/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/password', changeUserPassword);

module.exports = router;
