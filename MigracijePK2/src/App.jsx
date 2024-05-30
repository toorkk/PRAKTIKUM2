import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import Podrobnosti from './components/Podrobnosti';
import Home from './components/HomeComponent';
import Navbar123 from './components/Navbar123';
import PresekComponent from './components/PresekComponent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar123 />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/podrobnosti/:obcina" element={<Podrobnosti />} />
          <Route path="/presek" element={<PresekComponent />} />
          <Route path="/presek" element={<PresekComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
