import React from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';
import Player from './components/Player';
import Teams from './components/Teams';
import SetForm from './components/SetForm';
import Jornadas from './components/Jornadas';
import Competicion from './components/Competicion';
import CompeticionDragAndDrop from './components/CompeticionDragAndDrop/CompeticionDragAndDrop';
import TemporadasList from './components/Temporadas/TemporadasList';
import TemporadaDetalle from './components/Temporadas/TemporadaDetalle';
import Styling from './components/Styling';

const Router = process.env.NODE_ENV === 'production' ? HashRouter : BrowserRouter;

function App() {
  return (
    <Router>
      <Routes>
        {/* Acceso */}
        <Route path="/" element={<Login />} />

        {/* Rutas públicas (sin login) */}
        <Route element={<PublicLayout />}>
          <Route path="/ranking"   element={<Ranking />} />
          <Route path="/jugadores" element={<Player />} />
          <Route path="/jornadas"  element={<Jornadas />} />
          <Route path="/styling"   element={<Styling />} />
        </Route>

        {/* Rutas del dashboard (requieren login) */}
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index                  element={<Dashboard />} />
          <Route path="ranking"         element={<Ranking />} />
          <Route path="jugadores"       element={<Player />} />
          <Route path="equipos"         element={<Teams />} />
          <Route path="jornadas"        element={<Jornadas />} />
          <Route path="form"            element={<SetForm />} />
          <Route path="competicion"     element={<Competicion />} />
          <Route path="competicion-2"   element={<CompeticionDragAndDrop />} />
          <Route path="temporadas"      element={<TemporadasList />} />
          <Route path="temporadas/:id"  element={<TemporadaDetalle />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
