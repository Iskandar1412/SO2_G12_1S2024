import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import PieChartCPU from '../graphs/PieChartCPU'

function RealTime() {
    //const [dataram, setdataram] = useRef([]);
    //const [datacpu, setdatacpu] = useRef([]);
    const [cpuUsado, setCPUUsado] = useState(0);
    
    const charDataCPU = {
        labels: ['Usada', 'Libre', 'Proceso a', 'Proceso b'],
        datasets: [
            {
                label: 'Grafica CPU',
                data: [55, 20, 10, 15, cpuUsado+5],
                backgroundColor: [
                    'rgba(185, 35, 23, 0.5)',
                    'rgba(23, 185, 153, 0.5)',
                    'rgba(160, 115, 29, 0.7)',
                    'rgba(29, 160, 96, 0.7)',
                ],
                borderColor: [
                    'rgba(185, 35, 23, 1)',
                    'rgba(23, 185, 153, 1)',
                    'rgba(160, 115, 29, 1)',
                    'rgba(29, 160, 96, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    

    //console.log("CHart data:" , charDataCPU);
    
    const [contentPost, setcontentPost] = useState([]);
    const handleText = (e) => {
        setcontentPost(e.target.value);
    };

    

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
    const fetchData = useCallback(async () => {
        
        try {
            const response = await axios.get(`http://localhost:3200/live?eQuipo=`);
            const data = response.data;
            const proceso_val = data.CPU.Procesos;
            setCPUUsado(data.CPU.Uso_de_CPU);
            console.log(data.RAM);
            setProcesos(proceso_val)
            //console.log(data.CPU.Uso_de_CPU, data.RAM.Porcentaje_en_uso)
        } catch (e) {
            console.log('Error en la obtención de datos en tiempo real', e);
        }
    });

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    });

   
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