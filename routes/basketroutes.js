const router = require('express').Router();
const {
  checkBasket,
  addToBasket,
  getBasket,
  removeFromBasket,
} = require('../controllers/basket');

router.post('/check', checkBasket);
// 장바구니에 상품 추가
router.post('/add-to-basket', checkBasket, addToBasket);

// 장바구니 조회
router.get('/basket', checkBasket, getBasket);

// 장바구니에서 상품 삭제
router.delete('/remove-from-basket', checkBasket, removeFromBasket);

module.exports = router;
