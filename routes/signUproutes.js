const router = require('express').Router();
const { signUp } = require('../controllers/signUp');

router.post('/', signUp);

module.exports = router;
