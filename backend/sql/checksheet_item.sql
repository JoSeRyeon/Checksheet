CREATE TYPE item_type AS ENUM ('text','textarea','select');

CREATE TABLE checksheet_item (
    id SERIAL PRIMARY KEY,
    checklist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type item_type DEFAULT 'text',
    value TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES checksheet_checklist(id) ON DELETE CASCADE
);
