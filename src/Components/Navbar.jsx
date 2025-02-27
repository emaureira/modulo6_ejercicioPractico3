import React from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Hospital App</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/equipo-medico">Equipo Médico</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/citas">Citas</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </>
    );
}

// Definimos los PropTypes para el componente Navbar. Al no recibir props de un padre, queda vacío
Navbar.propTypes = {};

export default Navbar;