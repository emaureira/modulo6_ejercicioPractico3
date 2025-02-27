import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import fetchData from '../../api';
import { addCita, getAllCitas, deleteCita } from '../../db';
import Camara from '../camara';


function Citas() {
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [medico, setMedico] = useState('');
    const [errors, setErrors] = useState({});
    const [medicosPorEspecialidad, setMedicosPorEspecialidad] = useState({});
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [citas, setCitas] = useState([]); // Nuevo estado para las citas
    const [location, setLocation] = useState(null);
    const [image, setImage] = useState(null);

    const nombreInputRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const equipoMedicoData = await fetchData('equipoMedico');
                const serviciosData = await fetchData('servicios');

                // Optimización: Preprocesar doctores en un mapa por especialidad
                const doctorsBySpecialityMap = equipoMedicoData.reduce((acc, doctor) => {
                    acc[doctor.especialidad] = acc[doctor.especialidad] || [];
                    acc[doctor.especialidad].push(doctor.nombre);
                    return acc;
                }, {});

                const medicosMap = {};
                serviciosData.forEach(servicio => {
                    medicosMap[servicio.nombre] = doctorsBySpecialityMap[servicio.nombre] || [];
                });

                setMedicosPorEspecialidad(medicosMap);
                setServicios(serviciosData);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

      const loadCitas = async () => {
            try {
                const citasData = await getAllCitas();
                setCitas(citasData);
            } catch (err) {
                console.error("Error al cargar citas desde IndexedDB", err);
                 setError(err);
            }
        };

        loadData();
        loadCitas();

        if (nombreInputRef.current) {
            nombreInputRef.current.focus();
        }
    }, []);



    const validateForm = () => {
        let newErrors = {};
        if (!nombre) newErrors.nombre = 'El nombre es requerido';
        if (!fecha) newErrors.fecha = 'La fecha es requerida';
        if (!hora) {
            newErrors.hora = 'La hora es requerida';
        } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora)) {
            newErrors.hora = 'Formato de hora inválido (HH:MM)';
        }
        if (!especialidad) newErrors.especialidad = 'La especialidad es requerida';
        if (!medico) newErrors.medico = 'El médico es requerido';


        if (fecha) {
            const selectedDate = new Date(fecha);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.fecha = 'La fecha no puede ser anterior a hoy.';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

     const handleAddCita = async () => {
      if (validateForm()) {
          try {
            const newCita = {
                  nombre,
                  fecha,
                  hora,
                  especialidad,
                  medico,
                  location,
                  image,
              };
               console.log(newCita);
               await addCita(newCita);
                alert('Cita agendada y guardada en IndexedDB!');
                 const citasData = await getAllCitas();
                 setCitas(citasData);
              setNombre('');
              setFecha('');
              setHora('');
              setEspecialidad('');
              setMedico('');
              setLocation(null);
              setImage(null);
              setErrors({});
           } catch (err) {
             alert('Error al agendar la cita!');
              console.error('Error al agregar la cita:', err);
            }
      }
      };

    const handleSubmit = (event) => {
        event.preventDefault();
         handleAddCita();

    };


     const handleDeleteCita = async (id) => {
        try {
              await deleteCita(id);
              const citasData = await getAllCitas();
              setCitas(citasData);
              alert('Cita eliminada correctamente');
        } catch (err) {
              console.error('Error al eliminar la cita:', err);
        }
    };


    const handleEspecialidadChange = (event) => {
        setEspecialidad(event.target.value);
        setMedico('');
    }

    const medicosOptions = useMemo(() => {
        return medicosPorEspecialidad[especialidad]?.map((med, index) => (
            <option key={index} value={med}>{med}</option>
        ));
    }, [medicosPorEspecialidad, especialidad]);


    if (loading) {
        return <p>Cargando formulario de citas...</p>
    }
    if (error) {
        return <p>Error al cargar formulario de citas: {error.message}</p>
    }

    const handleCaptureImage = (imageData) => {
        setImage(imageData);
        console.log("Imagen Capturada en Citas:", imageData);
      };

    const getLocation = () => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
            },
            (error) => {
              console.log("Error obteniendo la ubicación:", error);
            }
          );
        } else {
          console.log("Geolocalización no soportada en este navegador.");
        }
        };

    return (
      <div className="container">
            <h1>Agendar Cita</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre del Paciente:</label>
                    <input
                        type="text"
                        id="nombre"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        ref={nombreInputRef}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha de la Cita:</label>
                    <input
                        type="date"
                        id="fecha"
                        className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                    {errors.fecha && <div className="invalid-feedback">{errors.fecha}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="hora" className="form-label">Hora de la Cita:</label>
                    <input
                        type="text"
                        id="hora"
                        className={`form-control ${errors.hora ? 'is-invalid' : ''}`}
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        placeholder="HH:MM"
                    />
                    {errors.hora && <div className="invalid-feedback">{errors.hora}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="especialidad" className="form-label">Especialidad:</label>
                    <select
                        id="especialidad"
                        className={`form-select ${errors.especialidad ? 'is-invalid' : ''}`}
                        value={especialidad}
                        onChange={handleEspecialidadChange}
                    >
                        <option value="">Selecciona una especialidad</option>
                        {servicios.map((esp, index) => (
                            <option key={index} value={esp.nombre}>{esp.nombre}</option>
                        ))}
                    </select>
                    {errors.especialidad && <div className="invalid-feedback">{errors.especialidad}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="medico" className="form-label">Médico:</label>
                    <select
                        id="medico"
                        className={`form-select ${errors.medico ? 'is-invalid' : ''}`}
                        value={medico}
                        onChange={(e) => setMedico(e.target.value)}
                        disabled={!especialidad}
                    >
                        <option value="">Selecciona un médico</option>
                        {medicosOptions}
                    </select>
                    {errors.medico && <div className="invalid-feedback">{errors.medico}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="imagen" className="form-label">Foto:</label>
                    <Camara onCapture={handleCaptureImage} />
                    {image &&  <img src={image} alt="Imagen Capturada" style={{ maxWidth: '200px', display: "block", margin:"10px" }}/> }
                </div>
                <div className='mb-3'>
                    <label htmlFor="localizacion">Ubicación:</label>
                    <button type="button" className="btn btn-light w-100" onClick={getLocation}>
                        Obtener Ubicación
                    </button>
                    {location ? (
                        <p>Latitud: {location.lat}, Longitud: {location.lon}</p>
                    ) : (
                        <p>No se ha definido la ubicación.</p>
                    )}
                   
                </div>

                <button type="submit" className="btn btn-primary">Agendar Cita</button>
             </form>

         <h2 className="mt-4">Citas Agendadas</h2>
                {citas.length > 0 ? (
                    <ul className="list-group">
                      
                        {citas.map((cita, index) => (
                            
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-start py-4">
                             <div className="ms-2 me-auto">
                                <div className="fw-bold">Nombre: {cita.nombre}</div>
                                <div>Especialidad: {cita.especialidad}, Médico: {cita.medico}</div>
                                <div>Fecha: {cita.fecha}, Hora: {cita.hora}</div>
                                <div> Imagen Paciente:
                                {cita.image && <img src={cita.image} alt="Foto de la Cita" style={{maxWidth: "100px", display: "block"}} />}
                                </div>
                                <div>
                                Ubicación:
                    {cita.location ? (
                        <p>
                            Latitud: {cita.location.lat.toFixed(4)}, Longitud: {cita.location.lon.toFixed(4)}
                            </p>
                        ) : (
                         <p>No disponible</p>
                        )}
                                </div>
                                
                            </div>
                            <button
                              onClick={() => handleDeleteCita(cita.id)}
                             className="btn btn-danger btn-sm">Eliminar</button>
                         </li>
                    ))}
                    </ul>
                 ) : (
                    <p>No hay citas agendadas.</p>
                    )}
        </div>
    );
}


Citas.propTypes = {};


export default Citas;