import { useEffect } from "react";
import "./Legend.css";
import { Tooltip } from "react-leaflet";

function MapInfo({hoveredLayer, leto}) {

  useEffect(() => {
    console.log('hoveredLayer: ',hoveredLayer);
  });

      return(
        <div id="info" className={'info legend leaflet-top leaflet-right'}>
          <h5>Indeks delovne migracije</h5>
          {hoveredLayer ? <>
          <h4><b>{hoveredLayer.name}</b></h4>
          <table className="yearWidth"><tbody>
            <tr>
            <th><h5 className="littleTransparent">{leto -1}</h5></th>
            <th><h5>{leto}</h5></th>
            <th><h5 className="littleTransparent">{parseInt(leto) +1}</h5></th>
            </tr>
            <tr>
            {leto != "2009" ? <th><h5 className="littleTransparent">{hoveredLayer.data[leto -1]}</h5></th> : <th><h5 className="littleTransparent">-------</h5></th>}
            <th><h5>{hoveredLayer.data[leto]}</h5></th>
            {leto != "2023" ? <th><h5 className="littleTransparent">{hoveredLayer.data[parseInt(leto) +1]}</h5></th> : <th><h5 className="littleTransparent">-------</h5></th>}
          </tr></tbody>
          </table>
          </> 
          : <><br/><h5><b>pomaknite miško preko občine/regije</b></h5><br/></>}
      </div>
      
      )
}

export default MapInfo;