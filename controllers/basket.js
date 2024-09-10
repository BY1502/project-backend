const database = require("../database/database");

// 장바구니 권한 조회
exports.checkBasket = async (req, res, next) => {
  try {
    const authData = req.cookies.authData;

    // authData가 undefined인 경우 처리
    if (!authData) {
      return res.status(401).json({ message: "인증 정보가 없습니다." });
    }

    const parsedAuthData = JSON.parse(authData);

    const result = await database.query(
      "SELECT user_key FROM aicc_5team WHERE email = $1",
      [parsedAuthData.email]
    );

    if (result.rows.length === 0 || result.rows[0].user_key !== "basket_key") {
      return res.status(403).json({
        message: "장바구니 권한이 없습니다. 회원가입 후 이용해주세요.",
      });
    }

    next(); // 권한이 있는 경우 다음 미들웨어로 이동
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 장바구니 추가

exports.addToBasket = async (req, res) => {
  const authData = JSON.parse(req.cookies.authData);
  const email = authData.email;
  // console.log('이메일값 :', email);
  try {
    const { productid } = req.body;

    const checkExist = await database.query(
      "SELECT * FROM basket WHERE email = $1 AND productid = $2",
      [email, productid]
    );

    if (checkExist.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "이미 장바구니에 있는 상품입니다." });
    }

    await database.query(
      "INSERT INTO basket (email, productid) VALUES ($1, $2)",
      [email, productid]
    );

    res.status(201).json({ message: "상품이 장바구니에 추가되었습니다." });
  } catch (error) {
    console.error("Error adding to basket:", error);
    res
      .status(500)
      .json({ message: "서버 오류: 장바구니에 상품을 추가할 수 없습니다." });
  }
};

// 사용자 별 장바구니 조회
exports.getBasket = async (req, res) => {
  try {
    const authData = JSON.parse(req.cookies.authData);
    const email = authData.email;

    const result = await database.query(
      `SELECT 
        product.productid,
        product.productname,
        product.productprice,
        product.productimage
      FROM 
        basket
      JOIN 
        product ON basket.productid = product.productid
      WHERE 
        basket.email = $1`,
      [email]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching basket:", error);
    res.status(500).json({ message: error.message });
  }
};

// 장바구니 삭제
exports.removeFromBasket = async (req, res) => {
  try {
    const authData = JSON.parse(req.cookies.authData);
    const email = authData.email;
    const { productid } = req.body;

    // 장바구니에서 특정 상품 삭제
    const result = await database.query(
      "DELETE FROM basket WHERE email = $1 AND productid = $2",
      [email, productid]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "장바구니에 해당 상품이 없습니다." });
    }

    res.status(200).json({ message: "상품이 장바구니에서 삭제되었습니다." });
  } catch (error) {
    console.error("Error removing from basket:", error);
    res.status(500).json({ message: error.message });
  }
};

// 선택된 상품들을 장바구니에서 삭제
exports.selectRemoveFromBasket = async (req, res) => {
  try {
    const { productids } = req.body;
    const authData = JSON.parse(req.cookies.authData);
    const email = authData.email;

    // 선택된 productid 배열을 바인딩하여 장바구니에서 삭제
    const result = await database.query(
      "DELETE FROM basket WHERE email = $1 AND productid = ANY($2::int[])",
      [email, productids]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "장바구니에 해당 상품이 없습니다." });
    }

    res
      .status(200)
      .json({ message: "선택된 상품들이 장바구니에서 삭제되었습니다." });
  } catch (error) {
    console.error("Error deleting selected products from basket:", error);
    res
      .status(500)
      .json({ message: "서버 오류: 선택된 상품들을 삭제할 수 없습니다." });
  }
};
