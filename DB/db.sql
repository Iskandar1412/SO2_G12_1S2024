CREATE DATABASE SOPES;
USE SOPES;

CREATE TABLE SOPES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pid INT,
    process_name VARCHAR(255),
    call_type VARCHAR(20),
    memory_size INT,
    request_datetime DATETIME
);

/*
docker run -d --name sopes2 -e MYSQL_ROOT_PASSWORD=iskandar -p 3306:3306 mysql:latest
docker inspect sopes2 | grep -i IPAddress
*/
