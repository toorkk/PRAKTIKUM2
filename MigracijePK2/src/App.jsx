import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapComponent from "./components/MapComponent";
import Podrobnosti from "./components/Podrobnosti";
import Sidebar from "./components/SideBar";
import Home from "./components/HomeComponent"
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/podrobnosti" element={<Podrobnosti />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
