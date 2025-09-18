CREATE TABLE checksheet_list (
    id SERIAL PRIMARY KEY,          -- 프라이머리 키, 자동 증가
    category VARCHAR(255) NOT NULL,  -- 체크시트명
    checksheet_name VARCHAR(255) NOT NULL,  -- 체크시트명
    status INT DEFAULT 1,             -- 스테이터스
    author VARCHAR(100) DEFAULT 'GUEST',            -- 작성자
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 등록일자
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- 수정일자
);