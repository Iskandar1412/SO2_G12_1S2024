import React, { useEffect, useState } from 'react';
import PieChartCPU from '../graphs/PieChartCPU'
import socketIOClient from 'socket.io-client'
import { path_back } from '../path_back';

function RealTime() {
    //const [dataram, setdataram] = useRef([]);
    //const [datacpu, setdatacpu] = useRef([]);
    
    const [items, setItems] = useState(null);
    const [procesos, setProcesos] = useState([]);
    const [MySQLData, setMySQLData] = useState([]);
    const [GraphData, setGraphData] = useState([
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: '-', Memoria_Porcent: 0 },
        { Proceso: 'Otros', Memoria_Porcent: 0 },
        { Proceso: 'Libre', Memoria_Porcent: 100 },

    ]);
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
    


    const chartDataGraph = {
        labels: [GraphData[0].Proceso, GraphData[1].Proceso, GraphData[2].Proceso, GraphData[3].Proceso, GraphData[4].Proceso, GraphData[5].Proceso, GraphData[6].Proceso, GraphData[7].Proceso, GraphData[8].Proceso, GraphData[9].Proceso, GraphData[10].Proceso, GraphData[11].Proceso],
        datasets: [
            {
                label: 'Grafica CPU',
                data: [GraphData[0].Memoria_Porcent, GraphData[1].Memoria_Porcent,GraphData[2].Memoria_Porcent,GraphData[3].Memoria_Porcent,GraphData[4].Memoria_Porcent, GraphData[5].Memoria_Porcent, GraphData[6].Memoria_Porcent, GraphData[7].Memoria_Porcent, GraphData[8].Memoria_Porcent, GraphData[9].Memoria_Porcent, GraphData[10].Memoria_Porcent, GraphData[11].Memoria_Porcent],
                backgroundColor: [
                    colorBase[0].base,
                    colorBase[1].base,
                    colorBase[2].base,
                    colorBase[3].base,
                    colorBase[4].base,
                    colorBase[5].base,
                    colorBase[6].base,
                    colorBase[7].base,
                    colorBase[8].base,
                    colorBase[9].base,
                    colorBase[10].base,
                    colorBase[11].base,
                ],
                borderColor: [
                    colorBase[0].borde,
                    colorBase[1].borde,
                    colorBase[2].borde,
                    colorBase[3].borde,
                    colorBase[4].borde,
                    colorBase[5].borde,
                    colorBase[6].borde,
                    colorBase[7].borde,
                    colorBase[8].borde,
                    colorBase[9].borde,
                    colorBase[10].borde,
                    colorBase[11].borde,
                ],
                borderWidth: 1,
            }
        ]
    };

    
    
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

    const [listaGrafica, setListaGrafica] = useState([]);
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
                Datos[pid].percentaje = Number(((Datos[pid].Memoria/(4 * (1024**2)))*100).toFixed(6));
            } else if (call_type === 'munmap') {
                Datos[pid].Memoria -= memory_size;
                Datos[pid].munmap += memory_size;
                Datos[pid].percentaje = Number(((Datos[pid].Memoria/(4 * (1024**2)))*100).toFixed(6));
            }
        });
        
        const DatosArray = Object.keys(Datos).map(pid => {
            return {
                PID: pid,
                ...Datos[pid]
            };
        });
        DatosArray.sort((a, b) => b.Memoria - a.Memoria);
        console.log(DatosArray)
        setListaGrafica(DatosArray);

        let top10 = DatosArray.filter(proceso => proceso.Memoria >= 0).slice(0, 10);
    
        let memoriaRestante = 0;
        for (let i = 10; i < DatosArray.length; i++) {
            memoriaRestante += DatosArray[i].percentaje;
        }
        
        let porcentajeMemoriaLibre = 100 - (top10.reduce((total, proceso) => total + proceso.percentaje, 0));
        
        let lista = top10.map(proceso => ({ Proceso: proceso.Proceso, Memoria_Porcent: proceso.percentaje }));
        
        while (lista.length < 10) {
            lista.push({ Proceso: "-", Memoria_Porcent: 0 });
        }
        
        lista.push({ Proceso: 'otros', Memoria_Porcent: memoriaRestante });
        lista.push({ Proceso: 'memoria libre', Memoria_Porcent: porcentajeMemoriaLibre });
        setGraphData(lista);
        console.log(lista)
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
                            <PieChartCPU dato={chartDataGraph} />

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
                                            {listaGrafica.map(proceso =>
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