const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const PORT = 8080;
const app = express();
const productRoutes = require('./controllers/product');
const path = require('path');
const basketController = require('./controllers/basket');
const userRoutes = require('./routes/mypageroutes');
// const router = express.Router();
// const kakao = require('./controllers/kakao');
// 파이썬 테스트 코드 시작
const { spawn } = require('child_process');
// const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// '/test' 엔드포인트 설정
app.post('/test', (req, res) => {
  const sendQuestion = req.body.question;

  // Python 스크립트의 경로 설정 (절대 경로)
  // const pythonPath = path.join(__dirname, 'chat', 'bin', 'python');
  // const pythonPath = '/opt/homebrew/bin/python3';
  const pythonPath = '/Users/shimgeon-u/test/team_project/back/venv/bin/python'; // 가상환경의 Python 경로
  const scriptPath = path.join(__dirname, 'test.py');

  // 파이썬 스크립트를 실행하여 질문을 전달
  const pythonProcess = spawn(pythonPath, [scriptPath, sendQuestion]);

  let output = '';

  // Python 스크립트의 stdout을 받아서 처리
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  // 파이썬 프로세스가 완료된 후 응답 처리
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.send({ response: output });
    } else {
      res.status(500).send('Python script failed');
    }
  });

  // 파이썬 스크립트의 stderr 처리
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});
// 파이썬 테스트 코드 끝

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(
  cors({
    origin: 'https://aiccfront.gunu110.com',
    credentials: true,
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});
app.use('/auth', authRoutes); // 구글 라우트
app.use('/api', productRoutes); // 상품 라우트
app.use('/img/back/img', express.static(path.join(__dirname, '/img')));

// 장바구니 라우트
app.use('/api', basketController.checkBasket); // 권한 체크 미들웨어
app.post('/api/add-to-basket', basketController.addToBasket);
app.get('/api/get-basket', basketController.getBasket);
app.post('/api/remove-from-basket', basketController.removeFromBasket);
app.post(
  '/api/select-remove-from-basket',
  basketController.selectRemoveFromBasket
);

// 마이페이지 라우트
app.use('/api/mypage', userRoutes);

// 기존 라우트 설정
app.use('/login', require('./routes/loginroutes'));
app.use('/signup', require('./routes/signUproutes'));

app.get('/', (request, response) => {
  response.send('aiccback.gunu110.com OK');
});

// kakao();
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
}); // 서버 실행 시 메시지
