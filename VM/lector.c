#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <mysql/mysql.h>
#include <time.h>

// sudo apt-get install libmysqlclient-dev
// gcc lector.c -o lector -I/usr/include/mysql -lmysqlclient
// gcc lector.c -o lector -lmysqlclient
// sudo stap systemtap.stp | ./lector

#define SERVER "172.17.0.2"
#define USER "root"
#define PASSWORD "iskandar"
#define DATABASE "SOPES"

#define MAX_QUERY_LEN 500

MYSQL *conn;

void finish_with_error()
{
    fprintf(stderr, "%s\n", mysql_error(conn));
    mysql_close(conn);
    exit(1);
}

int main()
{
    MYSQL_RES *res;
    MYSQL_ROW row;
    char query[MAX_QUERY_LEN];

    conn = mysql_init(NULL);
    if (conn == NULL)
    {
        fprintf(stderr, "mysql_init() failed\n");
        exit(1);
    }

    if (mysql_real_connect(conn, SERVER, USER, PASSWORD, DATABASE, 0, NULL, 0) == NULL)
    {
        fprintf(stderr, "Error connecting to database: %s\n", mysql_error(conn));
        mysql_close(conn);
        exit(1);
    }

    printf("Connected to MySQL database successfully\n");

    // Your SystemTap script goes here
    // For simplicity, I'll just simulate the data insertion
    // Replace this with your actual data retrieval logic from SystemTap

    int pid = 1234; // Example PID
    char process_name[] = "example_process";
    char call_type[] = "mmap";
    int memory_size = 1024; // Example memory size
    char request_datetime[] = "2024-04-12 12:00:00"; // Example datetime

    // Prepare the SQL statement
    sprintf(query, "INSERT INTO SOPES (pid, process_name, call_type, memory_size, request_datetime) VALUES (%d, '%s', '%s', %d, '%s')",
            pid, process_name, call_type, memory_size, request_datetime);

    // Execute the SQL statement
    if (mysql_query(conn, query))
    {
        fprintf(stderr, "Query execution failed: %s\n", mysql_error(conn));
        mysql_close(conn);
        exit(1);
    }

    printf("Data inserted successfully\n");

    mysql_close(conn);

    return 0;
}


/*
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 100 --slave /usr/bin/g++ g++ /usr/bin/g++-11 --slave /usr/bin/gcov gcov /usr/bin/gcov-11

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 90 --slave /usr/bin/g++ g++ /usr/bin/g++-12 --slave /usr/bin/gcov gcov /usr/bin/gcov-12

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 80 --slave /usr/bin/g++ g++ /usr/bin/g++-10 --slave /usr/bin/gcov gcov /usr/bin/gcov-10
*/

/*

*/