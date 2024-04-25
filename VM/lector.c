#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <mysql/mysql.h>
#include <time.h>
#include <unistd.h>

// sudo apt-get install libmysqlclient-dev
// sudo apt-get install libcurl4-openssl-dev
// gcc lector.c -o lector -I/usr/include/mysql -lmysqlclient
// gcc lector.c -o lector -lmysqlclient
// sudo stap systemtap.stp | ./lector
// Ultima funcional
// gcc lector.c -o lector -lmysqlclient -D_GNU_SOURCE


// #define SERVER "172.17.0.2"
// #define USER "root"
// #define PASSWORD "iskandar"
// #define DATABASE "SOPES"

#define SERVER "database-1.c5kseoemwdnm.us-east-1.rds.amazonaws.com"
#define USER "admin"
#define PASSWORD "iskandar1412"
#define DATABASE "SOPES"

#define MAX_QUERY_LEN 500
#define MAX_LINE_LENGTH 1024


MYSQL *conn;




void finish_with_error() {
    fprintf(stderr, "%s\n", mysql_error(conn));
    mysql_close(conn);
    exit(1);
}

typedef struct {
    int pid;
    char process_name[50];
    char syscall_name[15];
    char timestamp[50];
    unsigned long length;
} SystemTapRecord;


void parse_line(char *line, SystemTapRecord *record) {
    sscanf(line, "%d,%[^,],%[^,],%[^,],%ld", &record->pid, record->process_name, record->syscall_name, record->timestamp, &record->length);

    // Conversion tiempo
    struct tm tm;
    strptime(record->timestamp, "%a %b %d %H:%M:%S %Y", &tm);
    strftime(record->timestamp, sizeof(record->timestamp), "%Y-%m-%d %H:%M:%S", &tm);
}


int main() {
    MYSQL_RES *res;
    MYSQL_ROW row;
    char query[MAX_QUERY_LEN];

    conn = mysql_init(NULL);
    if (conn == NULL) {
        fprintf(stderr, "mysql_init() failed\n");
        exit(1);
    }

    if (mysql_real_connect(conn, SERVER, USER, PASSWORD, DATABASE, 0, NULL, 0) == NULL) {
        fprintf(stderr, "Error connecting to database: %s\n", mysql_error(conn));
        mysql_close(conn);
        exit(1);
    }

    printf("Connected to MySQL database successfully\n");

    FILE *fp;
    char line[MAX_LINE_LENGTH];
    SystemTapRecord record;

    fp = popen("sudo stap systemtap.stp", "r");
    if (fp == NULL) {
        perror("Error al ejecutar el script de SystemTap");
        exit(EXIT_FAILURE);
    }

    // printf("a\n");
    while (fgets(line, MAX_LINE_LENGTH, fp) != NULL) {
        // printf("b\n");
        parse_line(line, &record);
        // printf("PID: %d, Process: %s, Syscall: %s, Timestamp: %s, Length: %ld\n", record.pid, record.process_name, record.syscall_name, record.timestamp, record.length);
        
        sprintf(query, "INSERT INTO SOPES (pid, process_name, call_type, memory_size, request_datetime) VALUES (%d, '%s', '%s', %ld, '%s')", record.pid, record.process_name, record.syscall_name, record.length, record.timestamp);
        sleep(0.65);
        if (mysql_query(conn, query)) {
            fprintf(stderr, "Query execution failed: %s\n", mysql_error(conn));
            mysql_close(conn);
            exit(1);
        }
    }

    pclose(fp);

    mysql_close(conn);

    return 0;
}


/*
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 100 --slave /usr/bin/g++ g++ /usr/bin/g++-11 --slave /usr/bin/gcov gcov /usr/bin/gcov-11

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 90 --slave /usr/bin/g++ g++ /usr/bin/g++-12 --slave /usr/bin/gcov gcov /usr/bin/gcov-12

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 80 --slave /usr/bin/g++ g++ /usr/bin/g++-10 --slave /usr/bin/gcov gcov /usr/bin/gcov-10
*/

/*
gcc lector.c -o lector -lmysqlclient -D_GNU_SOURCE
*/