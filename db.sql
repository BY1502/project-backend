-- task라는 table 생성
CREATE TABLE task (
    _id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    isCompleted BOOLEAN NOT NULL DEFAULT false,
    isImportant BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId TEXT NOT NULL
);

-- 데이터 추가
INSERT INTO task (_id, title, description, date, isCompleted, isImportant, userId) 
VALUES ('1234', '할일1', '할일1 설명', '2021-08-01', false, false, 'ju22hy');

--task라는 table의 데이터 조회
SELECT * FROM task WHERE userId = 'ju22hy' ORDER BY created_at DESC(ASC);

--특정 사용자 데이터 필터 조회
SELECT * FROM task WHERE userId = 'ju22hyhch'

-- 데이터 삭제
DELETE FROM aicc_5team WHERE id = ;

-- 데이터 업데이트
UPDATE task SET iscompleted = true WHERE _id = '1235';

-- 트리거 함수 생성: updated_at 필드를 현재 시간으로 설정
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 트리거 생성: task 테이블에서 UPDATE가 발생할 때마다 update_updated_at_column 함수를 호출
CREATE TRIGGER update_task_updated_at
BEFORE UPDATE ON task
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- task 테이블의 created_at 필드는 행이 처음 삽입될 때만 설정.
-- updated_at 필드는 행이 업데이트될 때마다 트리거를 통해 현재 시간으로 자동 갱신.
-- BEFORE UPDATE 트리거는 레코드가 업데이트되기 직전에 updated_at 필드를 현재 시간으로 변경.

-- 상품테이블
CREATE TABLE Product (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    ProductDescription TEXT,
    ProductPrice VARCHAR(20),  -- 가격을 "109,000" 형태로 저장하기 위해 VARCHAR로 설정
    ProductImage VARCHAR(255)
);

--상품정보
INSERT INTO Product (ProductName, ProductDescription, ProductPrice, ProductImage)
VALUES ('SQUARE TANZ R. II', '6개의 작은 스퀘어 스톤이 세팅되어 있는 링입니다.
유광과 무광 텍스처 선택이 가능하며, 의미 있는 문구를 새길 수 있는 각인 서비스가 준비되어 있습니다.
-스톤 세팅 시 손으로 직접 작업하기 때문에 정 사각이 아닐 수 있으며 러프한 느낌이 날 수 있습니다.
-제작 후 사이즈 조정이 불가한 제품입니다.

-각인과 골드도금은 각각 추가요금이 있습니다.
', '109,000', 'back/img/ring1.jpg'),
       ('SDUAL BALL GOLD EARRINGS', '- 듀얼 볼 디자인의 견고한 원터치 이어링

- 볼이 꽉 찬 디자인으로 약간의 무게감이 있으니 참고 부탁드립니다.
', '162,000', 'back/img/earing1.jpg'),
	   ('BOLD PEARL BRACELET', '- 볼드한 담수진주 브레이슬릿
- 직접 왁스를 깎아 제작한 hand crafted 실버잠금 장식 포인트
', '118,000', 'back/img/vkf1.jpg'),
       ('SQUARE TANZ R. I', '작은 스퀘어 스톤이 세팅되어 있는 링입니다.

유광과 무광 텍스처 선택이 가능하며, 의미 있는 문구를 새길 수 있는 각인 서비스가 준비되어 있습니다.

-스톤 세팅 시 손으로 직접 작업하기 때문에 정 사각이 아닐 수 있으며 러프한 느낌이 날 수 있습니다. 
-제작 후 사이즈 조정이 불가한 제품입니다.
-각인과 골드도금은 각각 추가요금이 있습니다.
', '63,000', 'back/img/ring2.jpg');

--이미지 추가
ALTER TABLE Product
ADD COLUMN ProductImage2 VARCHAR(255),
ADD COLUMN ProductImage3 VARCHAR(255),
ADD COLUMN ProductImage4 VARCHAR(255);

--장바구니 테이블 추가
CREATE TABLE basket (
    id SERIAL PRIMARY KEY,           -- 장바구니 항목의 고유 식별자
    email VARCHAR(255) NOT NULL,     -- 사용자 이메일, aicc_5team 테이블의 email과 연결
    productid INTEGER NOT NULL,      -- 제품 고유 식별자, product 테이블의 productid와 연결
    FOREIGN KEY (email) REFERENCES aicc_5team(email) ON DELETE CASCADE,
    FOREIGN KEY (productid) REFERENCES product(productid) ON DELETE CASCADE
);
