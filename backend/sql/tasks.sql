CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                 -- 작업명
    category VARCHAR(100) NOT NULL,              -- 카테고리
    checksheet_id INT REFERENCES checksheet_list(id),-- 체크시트
    creator VARCHAR(100),                         -- 등록자
    created_at TIMESTAMP DEFAULT NOW(),          -- 등록일자
    updated_at TIMESTAMP DEFAULT NOW(),          -- 수정일자
    assignee VARCHAR(100),                        -- 작업자
    verifier VARCHAR(100),                        -- 확인자
    admin VARCHAR(100)                            -- 관리자
);
