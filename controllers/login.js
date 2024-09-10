const bcrypt = require("bcrypt");
const database = require("../database/database");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    // 데이터베이스에서 사용자 조회
    const { rows } = await database.query(
      "SELECT * FROM aicc_5team WHERE email = $1",
      [req.body.email]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "가입되지 않은 이메일입니다." });
    }

    // 비밀번호 비교
    const match = await bcrypt.compare(req.body.password, rows[0].password);

    if (!match) {
      return res.status(401).json({ error: "비밀번호가 잘못되었습니다." });
    }
    const nickname = rows[0].nickname;
    const email = rows[0].email;
    const token = jwt.sign({ nickname, email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    }); // 암호화될 데이터, 비밀키, 잔존시간

    res.cookie("token", token, {
      httpOnly: true, // 클라이언트에서 쿠키를 자바스크립트로 접근하지 못하게 함
      sameSite: "None", // CORS 상황에서 쿠키가 전달될 수 있도록 설정
    });
    return res.status(201).json({ token: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
