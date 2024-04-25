# SO2_G12_1S2024 Manual Tecnico


## API Node


- NodeJS 20.12.2

Instrucciones de Instalación y Ejecución

    Instalación de Dependencias: Ejecute npm install para instalar todas las dependencias necesarias. 

    Ejecución del Servidor: Use node index.js para iniciar el servidor.

### Descripción General
La API en Node.js se utiliza para facilitar la comunicación en tiempo real entre la base de datos y los clientes a través de un navegador web. Utiliza `socket.io` para enviar actualizaciones en tiempo real y `mysql2` para manejar operaciones de base de datos. Esto asegura que los usuarios finales siempre tengan acceso a la información más reciente sobre el uso de memoria por proceso.

### Configuración del Servidor
El servidor está configurado para utilizar varios módulos esenciales:
- `express`: Framework de servidor HTTP para Node.js.
- `http`: Módulo nativo para crear el servidor HTTP.
- `socket.io`: Biblioteca para comunicaciones en tiempo real entre el servidor y el cliente.
- `mysql2`: Cliente MySQL para Node.js que permite interactuar con la base de datos MySQL.
- `cors`:


## Dashboard

Es una aplicación web diseñada para visualizar en tiempo real el uso de memoria de los procesos en un sistema Linux. Utiliza `socket.io-client` para recibir datos actualizados de la API y renderiza gráficos y tablas que reflejan el estado actual de la memoria.

### Estructura del Componente
El componente `RealTime` es el principal y se encarga de gestionar el estado y la lógica para la visualización de datos. A continuación, se describen las partes clave de este componente:

- **Estado del Componente**: Se utilizan hooks de estado (`useState`) para manejar los datos de la memoria, los procesos y la configuración de los gráficos.
- **Conexión Socket.io**: Establece una conexión con el servidor backend para recibir los datos en tiempo real.
- **Gráfico de Torta**: Utiliza el componente `PieChartCPU` para mostrar la distribución de memoria entre los procesos.
- **Tablas de Datos**: Presenta dos tablas, una para mostrar los procesos y su uso de memoria, y otra para listar las operaciones de memoria recientes (`mmap` y `munmap`).



## Lector

### Funcionalidad
El programa realiza las siguientes funciones principales:
- **Lectura de Datos**: Escucha continuamente la salida del script de SystemTap.
- **Procesamiento de Datos**: Parsea la información obtenida para extraer los detalles relevantes como el PID del proceso, nombre del proceso, tipo de llamada (mmap o munmap), tamaño del segmento de memoria y la fecha de la solicitud.
- **Almacenamiento de Datos**: Conecta con la base de datos MySQL y almacena los datos procesados para su posterior análisis y visualización.

### Flujo de Trabajo
1. **Inicialización**: El programa establece una conexión con la base de datos MySQL usando credenciales preconfiguradas.
2. **Monitoreo**: Entra en un bucle infinito donde lee la salida del script de SystemTap.
3. **Extracción de Datos**: Utiliza expresiones regulares o funciones de string para extraer información de cada línea de la salida.
4. **Inserción en la Base de Datos**: Cada vez que se captura una solicitud de memoria, la información es inmediatamente insertada en la base de datos en la tabla correspondiente.


- Comandos usados para Correr lector.c

```
gcc lector.c -o lector -lmysqlclient -D_GNU_SOURCE
```

```
./lector
```

### Estructura del Systemtap

```
#! /usr/bin/env stap

probe syscall.mmap2 {
    ts = gettimeofday_s();
    length = length; 
    //pid, nombre, proceso, fecha, length
    printf("%d,%s,%s,%s,%ld\n", pid(), execname(), "mmap", ctime(ts), (length/1024))
}

probe syscall.munmap {
    ts = gettimeofday_s();
    length = length; 
    //pid, nombre, proceso, fecha, length
    printf("%d,%s,%s,%s,%ld\n", pid(), execname(), "munmap", ctime(ts), (length/1024))
}
```

En este codigo se utiliza los metodos de mmap y munmap para la obtención de procesos que hacen este tipo de llamadas, obteniendo:
* PID proceso
* Nombre del proceso
* Si es "mmap"/"munmap"
* Fecha & hora en la que hace la petición
* Tamaño de memoria que pide (en KB)


> Redirigir el systemtap

```
sudo stap -o output.txt systemtap.stp
```


#### Caso de utilizar kernel (No usado para el proyecto)

- Obtener Kernel

```
uname -r
```

- Descargar kernel

```
uname -r
```

```
get https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.tar.gz
```

```
sudo apt-get install build-essential libncurses-dev bison flex libssl-dev libelf-dev
```

```
sudo apt-get install linux-headers-$(uname -r)
```

```
make menuconfig
```

```
make -j$(nproc)
```

### Estructura Lector

- Librerias:

```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <mysql/mysql.h>
#include <time.h>
#include <unistd.h>
```

- Definiciones

```
#define SERVER "database-1.c5kseoemwdnm.us-east-1.rds.amazonaws.com"
#define USER "admin"
#define PASSWORD "iskandar1412"
#define DATABASE "SOPES"

#define MAX_QUERY_LEN 500
#define MAX_LINE_LENGTH 1024
```

- Estructura para obtención de información Systemtap

En este se tiene la estructura la cual obtendrá la información de cada proceso que haga la llamada de mmap/munmap. Todo se hace mediante el metodo de parse_line el cual obtiene la información mediante la estructura que se envia (record) que es la estructura de SystemTapRecord (estructura para obtener la información), leyendo la salida del systemtap y enviando la linea de caracteres para su parseo posterior.

```
typedef struct {
    int pid;
    char process_name[50];
    char syscall_name[15];
    char timestamp[50];
    unsigned long length;
} SystemTapRecord;

void parse_line(char *line, SystemTapRecord *record) {
    sscanf(line, "%d,%[^,],%[^,],%[^,],%ld", &record->pid, record->process_name, record->syscall_name, record->timestamp, &record->length);

    struct tm tm;
    strptime(record->timestamp, "%a %b %d %H:%M:%S %Y", &tm);
    strftime(record->timestamp, sizeof(record->timestamp), "%Y-%m-%d %H:%M:%S", &tm);
}

FILE *fp;
char line[MAX_LINE_LENGTH];
SystemTapRecord record;

fp = popen("sudo stap systemtap.stp", "r");
if (fp == NULL) {
    perror("Error al ejecutar el script de SystemTap");
    exit(EXIT_FAILURE);
}

while (fgets(line, MAX_LINE_LENGTH, fp) != NULL) {
    
    parse_line(line, &record);
    
    sprintf(query, "INSERT INTO SOPES (pid, process_name, call_type, memory_size, request_datetime) VALUES (%d, '%s', '%s', %ld, '%s')", record.pid, record.process_name, record.syscall_name, record.length, record.timestamp);
    sleep(0.65);
    if (mysql_query(conn, query)) {
        fprintf(stderr, "Query execution failed: %s\n", mysql_error(conn));
        mysql_close(conn);
        exit(1);
    }
}
```

En el ciclo while se hace mientras haya una linea para leer, este ciclo hace la verificación de la conexión con la base de datos de MySQL y cada tiempo inserta la información a la base de datos.



## Base de Datos

Se utilizo una base de datos MySQL por medio de docker, para el entorno de pruebas; posteriormente se subio a la nuve de AWS para la escritura y obtención de la información.

La base de datos tiene la siguiente estructura, para la obtención de la información:

```
CREATE TABLE SOPES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pid INT,
    process_name VARCHAR(255),
    call_type VARCHAR(20),
    memory_size INT,
    request_datetime DATETIME
);
```

## Backend (Node)

- Conexión DB de AWS

```
const db = mysql.createPool({
    connectionLimit: 10, 
    host: 'database-1.c5kseoemwdnm.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'iskandar1412',
    database: 'SOPES'
});
```

- Función de retorno de información de la base de datos

Esta función hace una petición a la base de datos para obtener dentro del límite los datos más recientes, retornandolos a una variable para su posterior envio al front mediante WebSocket.

```
function fetchDataFromDB() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * from SOPES ORDER BY id DESC LIMIT 1200;', (err, rows) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
```

- Conexión WebSocket

Se encarga de obtener de la base de datos y enviar a tiempo real la información que la base de datos obtiene y recibe. Para este caso se pusieron los emmit para obtener la información `data` la cual retorna al front cada vez que actualiza la información de la base de datos que obtiene. Tambien se cuenta con el `disconnect` el cual cuenta con la desconexión del socket.

```
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    const intervalId = setInterval(async () => {
        try {
            const data = await fetchDataFromDB();
            socket.emit('data', data);
        } catch (err) {
            console.error('Error al obtener datos de la DB:', err);
            socket.emit('error', 'Error al obtener datos');
        }
    }, 1000); 

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
```

## Front (React)

- Obtención de información mediante SocketIOClient

Mediante estas funciones a tiempo real se obtiene la información de la información del Backend de NodeJS en el front, mediante un `useEffect` se hace un llamado cada vez que el backend obtenga la información a la función que se encarga de obtener la información de la data obtenida del SystemTap mediante el Backend.

Se tiene otro `useEffect` para que las graficas actualicen cuando estén los datos cargados en las variables correspondientes, para evitar problemas de que una variable este inicializada antes de o este vacia y de error de que es un valor indefinido.

```
    useEffect(() => {
        funcionObtener(); 
    }, []);

    const funcionObtener  =() => {
        try {
            const socket = socketIOClient(path_back, {
                reconnection: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 1000,
            });

            socket.on('data', (data) => {
                //console.log('data',data);
                console.log("Recibiendo datos")
                setMySQLData(data)    
            });
    
            
            return () => {
                socket.off('data');
            }
        } catch (e) { }
    }

    useEffect(() => {
        processDataByDatos();
    }, [MySQLData])
```

- Mapeo información Lista Inferior (Procesos)

```
{procesos.map((proceso, index) =>
<div
    key={index}
    className={`list-item ${items === proceso.Proceso ? 'expanded' : ''}`}
    onClick={() => toggleItemExpansion(proceso.Proceso)}
>
    <span>{ proceso.PID }</span>
    <span>{ proceso.Llamada }</span>
    <span>{ proceso.Memoria }</span>
    <span>{ proceso.Fecha }</span>
</div>
)}
```
Se encarga de mapear la información cargada en la variable de procesos (que se actualiza constantemente), renderizando la información en la tabla definida


- Mapeo Tabla Procesos del Grafico de Pie

```
{
    listaGrafica.map(proceso =>
        <div
            key={proceso.PID}
            className={`list-item2 ${items === proceso.PID ? 'expanded' : ''}`}
            onClick={() => toggleItemExpansion(proceso.PID)}
        >
            <span>{ proceso.PID }</span>
            <span>{ proceso.Proceso }</span>
            <span>{ proceso.Memoria }</span>
            <span>{ proceso.percentaje }</span>
        </div>
    )
}
```

Mapea la información de los procesos con el total de memoria usada (KB)