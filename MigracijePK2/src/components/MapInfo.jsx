import { useEffect, useState, useRef } from "react";
import "./Legend.css";
import {useMap, useMapEvents} from "react-leaflet";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function MapInfo({hoveredLayer, leto, afterSliderChanged}) {
  const  [isFrozen,setIsFrozen] = useState(false);
  var last = useRef();

  const map = useMap()

  function mouseEnter() {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }

  function mouseLeave() {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    }

  //
  const mapEvents = useMapEvents({
    popupopen: () => {
      setIsFrozen(true);
    },
    popupclose: () => {
      last.current = hoveredLayer;
      setIsFrozen(false);
    },
  })
  
  useEffect(() => {
    if (!isFrozen && hoveredLayer) {
      last.current = hoveredLayer;
    }
  }, [hoveredLayer, isFrozen]);

  const currentLayer = isFrozen ? last.current : hoveredLayer;
  //

      return(
        <div className="leaflet-top leaflet-right">
        <div id="info" className={'info legend leaflet-control leaflet-bar'} style={{zIndex: 1000}} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
          <h5>Indeks delovne migracije</h5>
          {currentLayer ? <>
          <h4 style={{whiteSpace: 'nowrap'}}><b>{currentLayer.name}</b></h4>
          <table className="yearWidth"><tbody>
            <tr>
            <th><h5 className="littleTransparent">{leto -1}</h5></th>
            <th><h5>{leto}</h5></th>
            <th><h5 className="littleTransparent">{parseInt(leto) +1}</h5></th>
            </tr>
            <tr>
            {leto != "2009" ? <th><h5 className="littleTransparent"><b>{currentLayer.data[leto -1]}</b></h5></th> : <th><h5 className="littleTransparent">-------</h5></th>}
            <th><h5><b>{currentLayer.data[leto]}</b></h5></th>
            {leto != "2023" ? <th><h5 className="littleTransparent"><b>{currentLayer.data[parseInt(leto) +1]}</b></h5></th> : <th><h5 className="littleTransparent">-------</h5></th>}
          </tr></tbody>
          </table>
          </> 
          : <><br/><h5><b>pomaknite miško preko občine/regije</b></h5><br/></>}
          <Slider
          defaultValue={2023}
          min={2009}
          max={2023}
          marks={{ 2010: 2009, 2022: 2023 }}
          dots
          trackStyle={{ backgroundColor: 'gray', height: 12, marginTop: '-5px', borderColor: 'gray' }}
          handleStyle={{ borderColor: "gray", backgroundColor: "#FFFFFF" }}
          onChange={afterSliderChanged}
          dotStyle={{
            border: 'none',
            borderRadius: 0,
            height: 8,
            width: 1,
            backgroundColor: '#666',
          }}
        />
        <br/>
      </div>
      </div>
      
      )
}

export default MapInfo;