import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import ObcineGeo from '../../data/OBCINE.json'
import RegijeGeo from '../../data/SR.json'

function MapComponent() {

  return (
    <>

      <MapContainer id='map' center={[46.07118, 15.6]} zoom={8} scrollWheelZoom={true} placeholder={<h1>MAPA SE NALAGA, MOGOČE MORATE OMOGOČITI JAVASCRIPT</h1>}>
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON data={ObcineGeo} attribution="&copy; Štefan Baebler"/>

      </MapContainer>

    </>
  )
}

export default MapComponent;
