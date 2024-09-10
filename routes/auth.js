const express = require('express');
const router = express.Router();
const passport = require('../controllers/google'); // Google Passport 설정 불러오기
const bcrypt = require('bcrypt');
const pool = require('../database/database');

// Google 로그인 경로
router.get(
  '/google',
  (req, res, next) => {
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google 로그인 콜백 경로
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(req.user.email);
    res.redirect('http://localhost:3000/googleinfo?email=' + req.user.email);
  }
);

router.post('/googleinfo', async (req, res) => {
  const { password, contact, email } = req.body;
  console.log('email = ' + email);

  try {
    const user_key = 'basket_key';
    const hashedPassword = await bcrypt.hash(password, 10);

    // 데이터베이스 업데이트
    const result = await pool.query(
      `UPDATE aicc_5team 
      SET user_key = $1, password = $2, phone_number = $3 
      WHERE email = $4 
      RETURNING *`,
      [user_key, hashedPassword, contact, email]
    );

    res.status(200).json({
      message: '구글로 회원가입이 완료되었습니다.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Database error:', error.stack); // 오류 메시지 출력
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

module.exports = router;
