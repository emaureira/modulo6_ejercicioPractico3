import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';  // Importamos PropTypes

function Home() {
    const cardiologiaRef = useRef(null);
    const pediatriaRef = useRef(null);
    const dermatologiaRef = useRef(null);
    const neurologiaRef = useRef(null);

    const serviciosDestacados = [
        {
            titulo: "Cardiología",
            descripcion: "Diagnóstico y tratamiento de enfermedades del corazón.",
            ref: cardiologiaRef
        },
        {
            titulo: "Pediatría",
            descripcion: "Atención médica para niños y adolescentes.",
            ref: pediatriaRef
        },
        {
            titulo: "Dermatología",
            descripcion: "Diagnóstico y tratamiento de enfermedades de la piel.",
            ref: dermatologiaRef
        },
        {
            titulo: "Neurología",
            descripcion: "Diagnóstico y tratamiento de enfermedades del sistema nervioso.",
            ref: neurologiaRef
        }
    ];

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');

  useEffect(() => {
    // Recuperar datos de localStorage al cargar el componente
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      const { nombre: storedNombre, especialidad: storedEspecialidad } = JSON.parse(storedData);
      setNombre(storedNombre);
      setEspecialidad(storedEspecialidad);
    }
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const formData = {
      nombre: nombre,
      especialidad: especialidad,
    };
    // Guardar datos en localStorage
    localStorage.setItem('formData', JSON.stringify(formData));
     console.log("Formulario enviado y datos guardados en localStorage");
  };


  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

    const handleEspecialidadChange = (event) => {
    setEspecialidad(event.target.value);
  };
    
    return (
        <div className="container">
            <h1>Bienvenido al Hospital</h1>

           <h2>Háblame de ti: </h2>
            <div className="d-flex mb-3">
               <form onSubmit={handleSubmit}>
                    <label>Escribe tu nombre:
                        <input type="text" id="nombre" name="Name" value={nombre} onChange={handleNombreChange}  />
                    </label>
                    <label className='ms-3'>Especialidad frecuente a visitar:  
                        <input type="text" id="color" name="color" value={especialidad} onChange={handleEspecialidadChange} />
                    </label>
                    <button className='btn btn-info ms-3' type="submit">Enviar</button>
               </form>
            </div>
            <h2>Servicios Destacados</h2>
            <div className="row">
                {serviciosDestacados.map((servicio, index) => (
                    <div key={index} className="col-md-4 mb-3" ref={servicio.ref}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{servicio.titulo}</h5>
                                <p className="card-text">{servicio.descripcion}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2>Información del Hospital</h2>
            <p>
                Somos un hospital dedicado a brindar atención médica de alta calidad a nuestra comunidad. Contamos con un equipo de profesionales comprometidos y tecnología de vanguardia para ofrecer los mejores servicios.
            </p>
        </div>
    );
}

// Definimos los PropTypes para el componente Home. Al igual que los demás, no recibe props directamente desde un componente padre.
Home.propTypes = {};

export default Home;