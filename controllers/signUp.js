const database = require('../database/database'); // database 불러오기
const bcrypt = require('bcrypt');
const salt = 10;

exports.signUp = async (req, res) => {
  const { nickname, email, password, contact } = req.body;
  const user_key = 'basket_key';
  try {
    //데이터베이스에서 같은 값 조회
    const sameUser = await database.query(
      'SELECT * FROM aicc_5team WHERE email = $1 OR nickname = $2 OR phone_number = $3',
      [email, nickname, contact]
    );

    if (sameUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: '이미 존재하는 이메일, 닉네임 또는 전화번호입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, salt);

    // 데이터베이스에 사용자 정보 저장
    await database.query(
      'INSERT INTO aicc_5team (user_key, nickname, email, password, phone_number) VALUES ($1, $2, $3, $4, $5)',
      [user_key, nickname, email, hashedPassword, contact]
    );
    return res.status(201).json({
      message: '회원가입 완료',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
