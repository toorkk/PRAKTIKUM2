import './App.css';
import MapComponent from './components/MapComponent';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/SideBar.jsx';

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <div className="Sidebar">
            <Sidebar />
          </div>
          <div className="MapComponent">
            <MapComponent />
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
