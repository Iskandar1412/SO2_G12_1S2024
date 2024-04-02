import React from 'react'
import logo from '../Iskandar1.png'

function About() {
    return (
        <div id='layoutSidenav_content'>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">About</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">About Ourselves</li>
                    </ol>
                    <div className="row">


                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-primary text-white mb-4">
                                <div className="card-body">Desarrollador:</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a href="/About" className="small text-white stretched-link">Juan Urbina </a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-warning text-white mb-4">
                                <div className="card-body">Carne</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" href="/About">201906051</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-success text-white mb-4">
                                <div className="card-body">Semestre</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" href="/About">1S2024</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-danger text-white mb-4">
                                <div className="card-body">Github: Iskandar1412</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" target="blank" href="https://github.com/Iskandar1412">View Repository</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-primary text-white mb-4">
                                <div className="card-body">Desarrollador:</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a href="/About" className="small text-white stretched-link">Erick Mayorga</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-warning text-white mb-4">
                                <div className="card-body">Carne</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" href="/About">201901758</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-success text-white mb-4">
                                <div className="card-body">Semestre</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" href="/About">1S2024</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-danger text-white mb-4">
                                <div className="card-body">Github: ErickMayorgaR</div>
                                <div className="card-footer d-flex align-items-center justify-content-between">
                                    <a className="small text-white stretched-link" target="blank" href="https://github.com/ErickMayorgaR">View Repository</a>
                                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img src={logo} className="Logo-As-2" alt="logo" />
                </div>
            </main>
        </div>
    );
}

export default About;