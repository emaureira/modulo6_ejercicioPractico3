// src/api.js
async function fetchData(endpoint) {
    try {
        const response = await fetch('/assets/data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (endpoint === 'equipoMedico') {
            return data.equipoMedico;
        }
        if (endpoint === 'servicios') {
            return data.servicios;
        }
        throw new Error(`Invalid endpoint: ${endpoint}`);

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;  // Re-lanzamos el error para que el componente lo maneje
    }
}

export default fetchData;