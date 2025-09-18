CREATE TABLE checksheet_section (
    id SERIAL PRIMARY KEY,
    checksheet_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checksheet_id) REFERENCES checksheet_list(id) ON DELETE CASCADE
);
