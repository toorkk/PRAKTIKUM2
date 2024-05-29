import "./Legend.css";

function MapInfo({hoveredLayer, leto}) {

  console.log('hoveredLayer: ',hoveredLayer)

      return(
        <div className={'info legend leaflet-top leaflet-right'}>
          <h4>Indeks delovne migracije</h4>
          {hoveredLayer ? <><h5>{hoveredLayer.name}</h5><h5>{leto}: {hoveredLayer.data[leto]}</h5></> : <h5>mas to mali</h5>}
          
      </div>
      )
}

export default MapInfo;