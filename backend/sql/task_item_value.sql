-- 작업 항목 값 테이블
CREATE TABLE task_item_value (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,  -- ✅ CASCADE
    section_id INT REFERENCES checksheet_section(id),
    checklist_id INT REFERENCES checksheet_checklist(id),
    item_id INT REFERENCES checksheet_item(id),
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
