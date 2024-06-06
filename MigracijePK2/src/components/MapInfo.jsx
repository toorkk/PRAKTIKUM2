import { useEffect } from "react";
import "./Legend.css";
import { Tooltip } from "react-leaflet";

function MapInfo({hoveredLayer, leto}) {

  useEffect(() => {
    console.log('hoveredLayer: ',hoveredLayer);
  });

      return(
        <div className={'info legend leaflet-top leaflet-right'}>
          <h4>Indeks delovne migracije</h4>
          {hoveredLayer ? <><h5>{hoveredLayer.name}</h5><h5>{leto}: {hoveredLayer.data[leto]}</h5></> : <h5>mas to mali</h5>}
          <Tooltip>PROSIM PROSIM PROSIM</Tooltip>
      </div>
      
      )
}

export default MapInfo;