CREATE DATABASE SOPES;
USE SOPES;

CREATE TABLE SOPES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pid INT,
    process_name VARCHAR(255),
    call_type ENUM('mmap', 'munmap'),
    memory_size INT,
    request_datetime DATETIME
);
