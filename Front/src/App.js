//import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';
import Home from './pages/Home';
import About from './pages/About';
import RealTime from './pages/RealTime';
import 'https://use.fontawesome.com/releases/v6.1.0/js/all.js';
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
import logico from './Log.png'


function App() {
  let component 
    switch (window.location.pathname) {
      case "/":
        component = <Home />
        break;
      case "/About":
        component = <About />
        break;
      case "/RealTime":
        component = <RealTime />
        break;
      default:
        break;
    }


  return (
    <>
    <nav className='sb-topnav navbar navbar-expand navbar-dark bg-dark'>
      <img src={logico} className="Logo-Asv2" alt="logo" />
      <a className='navbar-brand ps-2' href="/">Proyecto Final</a>
      <button className='btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0' id='sidebarToggle'
        onClick={() => {
          document.body.classList.toggle('sb-sidenav-toggled');
          localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        }}
      ><i className='fas fa-bars'></i></button>
      
      
    </nav>
    <div id='layoutSidenav'>
      <Navbar />
      {component}
    </div>
    </>
  );
}

export default App;

/*

import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000'; // URL del servidor Socket.IO

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on('dataUpdate', newData => {
            setData(prevData => [...prevData, newData]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Datos de la base de datos:</h1>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;


*/