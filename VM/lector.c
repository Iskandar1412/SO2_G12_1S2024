#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <mysql/mysql.h>

// sudo apt-get install libmysqlclient-dev
// gcc lector.c -o lector -I/usr/include/mysql -lmysqlclient
// gcc lector.c -o lector -lmysqlclient
// sudo stap -g systemtap.stp | ./lector

#define SERVER "172.17.0.2"
#define USER "root"
#define PASSWORD "iskandar"
#define DATABASE "SOPES"

void insert_to_database(MYSQL *conn, int pid, char *process_name, char *call_type, int memory_size) {
    char query[512];
    sprintf(query, "INSERT INTO SOPES (pid, process_name, call_type, memory_size, request_datetime) VALUES (%d, '%s', '%s', %d, NOW())", pid, process_name, call_type, memory_size);

    if (mysql_query(conn, query)) {
        fprintf(stderr, "%s\n", mysql_error(conn));
        mysql_close(conn);
        exit(1);
    }
}

int main() {
    MYSQL *conn = mysql_init(NULL);
    if (conn == NULL) {
        fprintf(stderr, "Error initializing MySQL: %s\n", mysql_error(conn));
        exit(1);
    }

    if (mysql_real_connect(conn, SERVER, USER, PASSWORD, DATABASE, 0, NULL, 0) == NULL) {
        fprintf(stderr, "Error connecting to MySQL: %s\n", mysql_error(conn));
        mysql_close(conn);
        exit(1);
    }
    printf("Conectado\n");

    
    // Ejecutar STP
    FILE *stap_output = popen("sudo stap -g systemtap.stp", "r");
    if (stap_output == NULL) {
        fprintf(stderr, "Error executing SystemTap\n");
        mysql_close(conn);
        exit(1);
    }

    char line[512];
    while (fgets(line, sizeof(line), stap_output)) {
        printf("%s", line);
        int pid, memory_size;
        char process_name[256], call_type[16];

        sscanf(line, "%d,%255[^,],%15[^,],%d", &pid, process_name, call_type, &memory_size);
        insert_to_database(conn, pid, process_name, call_type, memory_size);
    }

    // Cerrar DB
    pclose(stap_output);
    printf("End\n");

    mysql_close(conn);
    return 0;
}


/*
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 100 --slave /usr/bin/g++ g++ /usr/bin/g++-11 --slave /usr/bin/gcov gcov /usr/bin/gcov-11

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 90 --slave /usr/bin/g++ g++ /usr/bin/g++-12 --slave /usr/bin/gcov gcov /usr/bin/gcov-12

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 80 --slave /usr/bin/g++ g++ /usr/bin/g++-10 --slave /usr/bin/gcov gcov /usr/bin/gcov-10
*/