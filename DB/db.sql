USE mem_monitoring;

CREATE TABLE memory_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pid INT,
    process_name VARCHAR(255),
    call_ VARCHAR(10),
    memory_size INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);