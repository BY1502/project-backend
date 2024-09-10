const database = require('../database/database');
const bcrypt = require('bcrypt');

// 유저 정보 조회
exports.getUserInfo = async (req, res) => {
  try {
    if (!req.cookies.authData) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const authData = JSON.parse(req.cookies.authData);
    const email = authData.email;

    const result = await database.query(
      'SELECT nickname, email, phone_number FROM aicc_5team WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '유저 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res
      .status(500)
      .json({ message: '서버 오류: 유저 정보를 가져올 수 없습니다.' });
  }
};

// 비밀번호 확인 및 탈퇴
exports.checkPassword = async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.authData) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { password } = req.body;
    const authData = JSON.parse(req.cookies.authData);
    const email = authData.email;

    const result = await database.query(
      'SELECT password FROM aicc_5team WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '유저 정보를 찾을 수 없습니다.' });
    }

    const hashedPassword = result.rows[0].password;
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호가 일치하면 OK 응답을 반환
    res.status(200).json({ message: '비밀번호가 확인되었습니다.' });
  } catch (error) {
    console.error('Error checking password:', error);
    res
      .status(500)
      .json({ message: '서버 오류: 비밀번호 확인 중 오류가 발생했습니다.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.authData) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const authData = JSON.parse(req.cookies.authData);
    const email = authData.email;

    // 회원 탈퇴 처리
    await database.query('DELETE FROM aicc_5team WHERE email = $1', [email]);

    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res
      .status(500)
      .json({ message: '서버 오류: 회원 탈퇴 중 오류가 발생했습니다.' });
  }
};
