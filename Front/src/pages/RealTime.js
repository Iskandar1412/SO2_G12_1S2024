import React, { useCallback, useEffect, useRef, useState } from 'react';
import PieChartCPU from '../graphs/PieChartCPU'
import socketIOClient from 'socket.io-client'
import { path_back } from '../path_back';

function RealTime() {
    //const [dataram, setdataram] = useRef([]);
    //const [datacpu, setdatacpu] = useRef([]);
    const [cpuUsado, setCPUUsado] = useState(0);
    const colorBase = [
        { base: "rgba(185, 35, 23, 0.5)", borde: "rgba(185, 35, 23, 1)" },
        { base: "rgba(23, 185, 153, 0.5)", borde: "rgba(23, 185, 153, 1)" },
        { base: "rgba(160, 115, 29, 0.7)", borde: "rgba(160, 115, 29, 1)" },
        { base: "rgba(29, 160, 96, 0.7)", borde: "rgba(29, 160, 96, 1)" },
        { base: "rgba(230, 126, 34, 0.7)", borde: "rgba(230, 126, 34, 1)" },
        { base: "rgba(52, 73, 94, 0.7)", borde: "rgba(52, 73, 94, 1)" },
        { base: "rgba(50, 160, 96, 0.7)", borde: "rgba(50, 160, 96, 1)" },
        { base: "rgba(169, 50, 38, 0.7)", borde: "rgba(169, 50, 38, 1)" },
        { base: "rgba(125, 60, 152, 0.7)", borde: "rgba(125, 60, 152, 1)" },
        { base: "rgba(46, 134, 193, 0.7)", borde: "rgba(46, 134, 193, 1)" },
        { base: "rgba(23, 165, 137, 0.7)", borde: "rgba(23, 165, 137, 1)" },
        { base: "rgba(241, 196, 15, 0.7)", borde: "rgba(241, 196, 15, 1)" },
        { base: "rgba(51, 255, 144, 0.7)", borde: "rgba(51, 255, 144, 1)" },
        { base: "rgba(51, 116, 255, 0.7)", borde: "rgba(51, 116, 255, 1)" },
    ];
    


    const charDataCPU = {
        labels: ['Usada', 'Libre', 'Proceso a', 'Proceso b', 'proceso'],
        datasets: [
            {
                label: 'Grafica CPU',
                data: [55, 20, 10, 15, cpuUsado+5],
                backgroundColor: [
                    colorBase[0].base,
                    colorBase[1].base,
                    colorBase[2].base,
                    colorBase[3].base,
                    colorBase[4].base,
                ],
                borderColor: [
                    colorBase[0].borde,
                    colorBase[1].borde,
                    colorBase[2].borde,
                    colorBase[3].borde,
                    colorBase[4].borde,
                ],
                borderWidth: 1,
            }
        ]
    };

    

    //console.log("CHart data:" , charDataCPU);
    

    

    //items para procesos
    const [items, setItems] = useState(null);
    const [procesos, setProcesos] = useState([]);
    //const itmp = [
    //    { id: 1, proceso:'asdf', pid: 12465, uid: 1212, estado: "U", memoriav: 1250, memoriaf: 12546 },
    //    { id: 2, proceso:'asdff', pid: 1364, uid: 12512, estado: "S", memoriav: 1450, memoriaf: 122 },
    //    { id: 3, proceso:'python', pid: 4879, uid: 412, estado: "T", memoriav: 250, memoriaf: 1254 },
    //    { id: 4, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //    { id: 5, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //    { id: 6, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //    { id: 7, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //    { id: 8, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //    { id: 9, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //    { id: 10, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //    { id: 11, proceso:'hola', pid: 1364, uid: 469, estado: "S", memoriav: 550, memoriaf: 1468 },
    //];
    
    const [MySQLData, setMySQLData] = useState([]);

    useEffect(() => {
        setInterval(() => {
            funcionObtener();
        }, 1000);
    }, []);

    const funcionObtener  =() => {
        try {
            const socket = socketIOClient(path_back, {
                reconnection: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 1000,
            });

            socket.on('data', (data) => {
                // console.log('data',data);
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

    const processDataByDatos = () => {
        const Datos = {};
        MySQLData.forEach(item => {
            const { pid, process_name, call_type, memory_size } = item;
            
            
            if (!Datos[pid]) {
                Datos[pid] = {
                    Proceso: process_name,
                    Memoria: 0,
                    mmap: 0,
                    munmap: 0,
                    percentaje : 0
                };
            }
            
            if (call_type === 'mmap') {
                Datos[pid].mmap += memory_size;
                Datos[pid].Memoria += memory_size;
                Datos[pid].percentaje = (Datos[pid].Memoria/(10*(2**30)))*100;
            } else if (call_type === 'munmap') {
                Datos[pid].Memoria -= memory_size;
                Datos[pid].munmap += memory_size;
                Datos[pid].percentaje = (Datos[pid].Memoria/(10*(2**30)))*100;
            }
        });
        
        const DatosArray = Object.keys(Datos).map(pid => {
            return {
                PID: pid,
                ...Datos[pid]
            };
        });
        
        console.log(DatosArray);
    };
    
    

   
    const toggleItemExpansion = (itemID) => {
        setItems(prevId => (prevId === itemID ? null : itemID));
    };

    return (
        <div id='layoutSidenav_content'>
            <main>
                <main className="container-w">
                    <input id="tab1" type="radio" name="tabs" defaultChecked />
                    <label htmlFor="tab1" className="label-type">Real Time</label>
                    <section id="content1" className="tabs-contentype">
                        
                        

                        <div className='container-pies'>
                            <PieChartCPU dato={charDataCPU} />

                            <div className='tab-section-5'>
                                <div className='tab-content2'>
                                    <div className='content-text'>
                                        <div className='lista-procesos'>
                                            <div className='list-item2 header'>
                                                
                                                <span>PID</span>
                                                <span>Nombre</span>
                                                <span>Memoria</span>
                                                <span>Memoria %</span>
                                            </div>
                                            {procesos.map(proceso =>
                                                <div
                                                    key={proceso.Proceso}
                                                    className={`list-item2 ${items === proceso.Proceso ? 'expanded' : ''}`}
                                                    onClick={() => toggleItemExpansion(proceso.Proceso)}
                                                >
                                                    <span>{ proceso.PID }</span>
                                                    <span>{ proceso.Llamada }</span>
                                                    <span>{ proceso.Proceso }</span>
                                                    <span>{ proceso.Fecha }</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                        
                        <div className='tab-section-2'>
                            <div className='tab-content'>
                                <div className='content-text'>
                                    <div className='lista-procesos'>
                                        <div className='list-item header'>
                                            
                                            <span>PID</span>
                                            <span>Llamada</span>
                                            <span>Tamaño</span>
                                            <span>Fecha</span>
                                        </div>
                                        {procesos.map(proceso =>
                                            <div
                                                key={proceso.Proceso}
                                                className={`list-item ${items === proceso.Proceso ? 'expanded' : ''}`}
                                                onClick={() => toggleItemExpansion(proceso.Proceso)}
                                            >
                                                <span>{ proceso.PID }</span>
                                                <span>{ proceso.Llamada }</span>
                                                <span>{ proceso.Proceso }</span>
                                                <span>{ proceso.Fecha }</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>

                    
                </main>
            </main>
        </div>
    );        
}

export default RealTime;