import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/views/Home';
import EquipoMedico from './components/views/EquipoMedico';
import Citas from './Components/views/Citas';
import Navbar from './Components/Navbar';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/equipo-medico" element={<EquipoMedico />} />
                <Route path="/citas" element={<Citas />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
