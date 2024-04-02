#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>


typedef struct {
    pid_t pid;
    char nombre_proceso[100];
    char llamada[10];
    size_t tamanio;
    time_t timestamp;
} solicitud_memoria;