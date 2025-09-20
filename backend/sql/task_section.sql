-- 작업 섹션 테이블
CREATE TABLE task_section (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE  -- ✅ CASCADE
    section_id INT REFERENCES checksheet_section(id),
    checked_at TIMESTAMP     -- 섹션 체크 시각
);
