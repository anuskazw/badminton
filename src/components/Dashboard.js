import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Asegúrate de crear un archivo CSS para estilos específicos del dashboard

function Dashboard() {
    // Aquí puedes agregar lógica para obtener y mostrar los resultados de la liga
    return (
        <div className="dashboard-container">
            <h2>Resultados de la Liga de Bádminton</h2>
            {/* Aquí puedes agregar tablas, gráficos, etc. para mostrar los resultados */}
            <div className="card-container">
                <Link to="/ranking" className="card">
                    <h3>Ranking</h3>
                    <p>Accede al ranking de jugadores.</p>
                </Link>
                <Link to="/equipos" className="card">
                    <h3>Equipos</h3>
                    <p>Consulta la lista de equipos.</p>
                </Link>
                <Link to="/jugadores" className="card">
                    <h3>Jugadores</h3>
                    <p>Información sobre los jugadores.</p>
                </Link>
                <div className="card">
                    <h3>Normativa</h3>
                    <p>Revisa las normativas del juego.</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 