import { useState } from 'react'
import './App.css'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <h1>MIGRACIJE</h1>
      <MapContainer id='map' center={[46.4131077, 15.8648681]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[46.4131077, 15.8648681]}>
          <Popup>
            VEM KJE ŽIVIŠ
          </Popup>
        </Marker>
      </MapContainer>


    </>
  )
}

export default App
