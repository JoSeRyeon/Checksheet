CREATE TYPE item_type AS ENUM ('input','textarea','select', 'button');

CREATE TABLE checksheet_item (
    id SERIAL PRIMARY KEY,
    checklist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type item_type DEFAULT 'input',
    value TEXT,
    options TEXT[] DEFAULT '{}',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES checksheet_checklist(id) ON DELETE CASCADE
);
