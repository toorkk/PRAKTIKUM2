import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import Podrobnosti from './components/Podrobnosti';
import Home from './components/HomeComponent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<MapComponent />} />
          <Route path="/podrobnosti/:obcina/:leto" element={<Podrobnosti />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
