CREATE TABLE code_master (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(50) DEFAULT NULL,
    UNIQUE(category, code)
);

-- 체크시트 상태
INSERT INTO code_master (category, code, name, color) VALUES
('checksheet_status', '1', '작성중', 'geekblue'),
('checksheet_status', '2', '사용중', 'green'),
('checksheet_status', '3', '폐기', 'default');