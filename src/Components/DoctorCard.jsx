import React from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes

function DoctorCard({ name, specialty, image }) {
    return (
        <div className="card" style={{ width: "18rem" }}>
            <img src={image} className="card-img-top" alt={`Dr. ${name}`} />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{specialty}</p>
            </div>
        </div>
    );
}

// Definimos los PropTypes para el componente DoctorCard. Aquí especificamos los tipos esperados para las props.
DoctorCard.propTypes = {
    name: PropTypes.string.isRequired, // name debe ser una cadena y es requerida.
    specialty: PropTypes.string.isRequired, // specialty debe ser una cadena y es requerida.
    image: PropTypes.string.isRequired, // image debe ser una cadena y es requerida.
};

export default DoctorCard;