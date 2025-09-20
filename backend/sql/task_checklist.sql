-- 작업 체크리스트 테이블
CREATE TABLE task_checklist (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,  -- ✅ CASCADE
    section_id INT REFERENCES checksheet_section(id),
    checklist_id INT REFERENCES checksheet_checklist(id),
    checked_at TIMESTAMP
);