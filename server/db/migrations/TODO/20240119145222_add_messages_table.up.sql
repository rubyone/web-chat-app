CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content TEXT,
    room_id VARCHAR(255),
    username VARCHAR(255),
    clients_id VARCHAR(255),
    FOREIGN KEY (clients_id) REFERENCES clients(id)
);