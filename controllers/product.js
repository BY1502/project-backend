const pool = require('../database/database');
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/products', async (req, res) => {
  try {
    // 필요한 컬럼만 선택해서 데이터베이스 쿼리
    const result = await pool.query(
      'SELECT productname, productprice, productimage, productcategory,productdescription,productimage2, productid FROM product'
    );
    // 결과를 JSON 형태로 반환
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});

// 특정 productid에 해당하는 상품 정보 가져오기
router.get('/products/:productid', async (req, res) => {
  const productid = req.params.productid;

  try {
    const result = await pool.query(
      'SELECT productname, productprice, productimage, productcategory, productdescription, productimage2 FROM product WHERE productid = $1',
      [productid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Server Error');
  }
});

router.use('/img/back/img', express.static(path.join(__dirname, '/img')));

module.exports = router;
