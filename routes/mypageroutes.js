const express = require('express');
const router = express.Router();
const userController = require('../controllers/mypage');

// 사용자 정보를 가져오는 경로
router.get('/getUserInfo', userController.getUserInfo);

// 비밀번호 확인 경로
router.post('/checkPassword', userController.checkPassword);

// 회원탈퇴 경로
router.delete('/delete', userController.deleteUser);

module.exports = router;
