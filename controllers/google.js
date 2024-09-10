const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../database/database'); // 데이터베이스 연결

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        const results = await pool.query(
          'INSERT INTO aicc_5team (user_key, nickname, email, password, phone_number) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO UPDATE SET nickname = $2 RETURNING *',
          [id, displayName, email, '', '']
        );
        const user = results.rows[0];
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('serial', user);
  done(null, user.email); // 세션에 저장할 데이터
});

passport.deserializeUser(async (email, done) => {
  // console.log('Deserializing user with email:', email);
  try {
    const results = await pool.query(
      'SELECT * FROM aicc_5team WHERE email = $1',
      [email]
    );
    const user = results.rows[0];
    // console.log('User found:', user);
    done(null, user);
  } catch (err) {
    console.error('Error during deserialization:', err);
    done(err, null);
  }
});

module.exports = passport;
