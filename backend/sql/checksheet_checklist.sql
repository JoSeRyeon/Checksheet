CREATE TABLE checksheet_checklist (
    id SERIAL PRIMARY KEY,
    section_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES checksheet_section(id) ON DELETE CASCADE
);
