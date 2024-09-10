// const passport = require('passport');
// const KakaoStrategy = require('passport-kakao').Strategy;
// const pool = require('../database/database'); // 데이터베이스 연결

// module.exports = () => {
//   new KakaoStrategy(
//     {
//       clientID: process.env.KAKAO_ID,
//       callbackURL: 'http://localhost:8080/kakao/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const { id, displayName, emails } = profile;
//         const email = emails[0].value;

//         const results = await pool.query(
//           'INSERT INTO aicc_5team (user_key, nickname, email, password, phone_number) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET nickname = $2 RETURNING *',
//           [id, displayName, email, '', '']
//         );
//         const user = results.rows[0];
//         done(null, user);
//       } catch (error) {
//         console.log(error);
//         done(error);
//       }
//     }
//   );
// };
