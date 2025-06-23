// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 微信登录或注册
router.post('/login', userController.loginWithOpenId);
  

// 获取用户信息
router.get('/:id', userController.getUserById);

// 更新用户信息
router.put('/:id', userController.updateUser);

module.exports = router;
