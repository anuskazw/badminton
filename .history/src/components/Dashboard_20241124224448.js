import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Asegúrate de crear un archivo CSS para estilos específicos del dashboard

function Dashboard() {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        // Simulación de obtención de datos de jugadores
        const jugadores = [
            { nombre: 'Jugador 1', puntos: 1200 },
            { nombre: 'Jugador 2', puntos: 1500 },
            { nombre: 'Jugador 3', puntos: 1100 },
            // Agrega más jugadores según sea necesario
        ];

        // Ordenar jugadores por puntos de mayor a menor
        const rankingOrdenado = jugadores.sort((a, b) => b.puntos - a.puntos);
        setRanking(rankingOrdenado);
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Resultados de la Liga de Bádminton</h2>
            {/* Aquí puedes agregar tablas, gráficos, etc. para mostrar los resultados */}
            <p>Próximamente: Resultados detallados...</p>
            <h3>Ranking de Jugadores</h3>
            <ul>
                {ranking.map((jugador, index) => (
                    <li key={index}>
                        {index + 1}. {jugador.nombre} - {jugador.puntos} puntos
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard; 