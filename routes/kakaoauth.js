// const passport = require('../controllers/kakao');
// const bcrypt = require('bcrypt');
// const pool = require('../database/database');

// router.get('/kakao/auth', isNotLoggedIn, passport.authenticate('kakao'));

// router.get(
//   '/kakao/callback',
//   passport.authenticate('kakao', {
//     failureRedirect: '/', // 로그인 실패 후 프론트엔드로 리다이렉트
//   }),
//   (req, res) => {
//     res.redirect(process.env.FRONT_END_DOMAIN); // 로그인 성공후 프론트엔드로 리다이렉트
//   }
// );

// module.exports = () => {
//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUse(async (id, done) => {
//     try {
//       await User.fineOne({ where: { id } });
//       done(null, user); //req.user
//     } catch (error) {
//       console.error(error);
//       done(error);
//     }
//   });
// };
