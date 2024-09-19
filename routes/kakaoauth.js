const express = require('express');
const passport = require('passport');
require('../controllers/kakao')(); // 카카오 전략 초기화

const router = express.Router();

// 카카오 로그인 라우트 (카카오로 리디렉션)
router.get('/kakao', passport.authenticate('kakao'));

// 카카오 로그인 콜백 처리 라우트
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/login', // 로그인 실패 시 리디렉션할 경로
  }),
  (req, res) => {
    // 로그인 성공 시 리디렉션할 경로
    res.redirect('/');
  }
);

module.exports = router;
