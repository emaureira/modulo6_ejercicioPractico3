import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes
import DoctorCard from '../DoctorCard';
import fetchData from '../../api';

function EquipoMedico() {
    const [doctors, setDoctors] = useState([]);
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchData('equipoMedico');
                setDoctors(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false)
            }
        };
        loadData();
    }, []);

    const handleFilterChange = (event) => {
        setFilterSpecialty(event.target.value);
    };

    const filteredDoctors = filterSpecialty
        ? doctors.filter(doctor => doctor.especialidad === filterSpecialty)
        : doctors;

    const uniqueSpecialties = ["Todas", ...new Set(doctors.map(doctor => doctor.especialidad))];

    if (loading) {
        return <p>Cargando equipo médico...</p>;
    }
    if (error) {
        return <p>Error al cargar equipo médico: {error.message}</p>
    }

    return (
        <div>
            <h1>Equipo Médico</h1>
            <div className="mb-3">
                <label htmlFor="specialtyFilter" className="form-label">Filtrar por Especialidad:</label>
                <select id="specialtyFilter" className="form-select" value={filterSpecialty} onChange={handleFilterChange}>
                    {uniqueSpecialties.map((specialty, index) => (
                        <option key={index} value={specialty}>
                            {specialty}
                        </option>
                    ))}
                </select>
            </div>
            <div className="row">
                {filteredDoctors.map((doctor, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <DoctorCard
                            name={doctor.nombre}
                            specialty={doctor.especialidad}
                            image={`https://via.placeholder.com/200x150/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff?text=${doctor.nombre.split(' ')[0]}`} // placeholder con nombre del doctor
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Definimos los PropTypes para el componente EquipoMedico. Nuevamente, no recibe props del padre, por lo que esta vacío.
EquipoMedico.propTypes = {};

export default EquipoMedico;