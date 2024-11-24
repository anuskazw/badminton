import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';
import Player from './components/Player';
import Teams from './components/Teams';

const players = [
  { id: 1, name: 'Jugador 1', j1: 10, j2: 15, j3: 20, total: 45 },
  { id: 2, name: 'Jugador 2', j1: 12, j2: 18, j3: 22, total: 52 },
  { id: 3, name: 'Jugador 3', j1: 14, j2: 16, j3: 24, total: 54 },
  { id: 4, name: 'Jugador 4', j1: 11, j2: 19, j3: 21, total: 51 },
  // Añade más jugadores
];
const teams = [
  { id: 1, name: 'Equipo A', total: 45, jugadores: ['Pepito Pérez', 'Ana Caballero', 'Juanito López'] },
  { id: 2, name: 'Equipo B', total: 35, jugadores: ['Carlos Ruiz', 'María Gómez', 'Luis Fernández'] },
  { id: 3, name: 'Equipo C', total: 55, jugadores: ['Sofía Martínez', 'Diego Torres', 'Ana Sánchez'] }
]

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/jugadores" element={<Player players={players} />} />
                    <Route path="/equipos" element={<Teams teams={teams}/>} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
