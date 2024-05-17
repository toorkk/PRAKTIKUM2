import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import OBCINA from '../../data/OBCINE.json'

function MapComponent() {

  return (
    <>

      <MapContainer id='map' center={[46.07118, 15.0]} zoom={8} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={OBCINA} />

      </MapContainer>

    </>
  )
}

export default MapComponent;
