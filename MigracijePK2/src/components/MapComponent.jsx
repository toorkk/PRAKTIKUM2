import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, LayersControl, Tooltip, ZoomControl } from 'react-leaflet';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Legend from "./Legend";
import MapInfo from './MapInfo';
import GeoJsonController from './GeoJsonController';
import NavigationPanel from './NavigationPanel'; 

function MapComponent() {
  const [leto, setLeto] = useState('2023');
  const [hoveredLayer, setHoveredLayer] = useState();

  var obcineGeoRef = useRef();
  var regijeGeoRef = useRef();

  const handleHoveredLayerChange = useCallback((newHoveredLayer) => {
    setHoveredLayer(newHoveredLayer);
  }, []);

  const handleSelectObcina = useCallback((obcinaId) => {
    const obcineLayers = obcineGeoRef.current.getLayers();
    const foundLayer = obcineLayers.find(layer => layer.feature.properties.OB_ID == obcinaId);
    foundLayer.openPopup();

    console.log('foundLayer: ', foundLayer.feature.properties);
  }, []);

  function afterSliderChanged(value) {
    setLeto(value);
  }

  return (
    <>
      <MapContainer id='map' center={[46.07118, 14.8]} zoom={8.5} scrollWheelZoom={true} placeholder={<h1>MAPA SE NALAGA, MOGOČE MORATE OMOGOČITI JAVASCRIPT</h1>} zoomSnap={0.5} zoomDelta={0.5} zoomControl={false}>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.jawg.io/27bb4850-08f0-424e-808a-c9e1a2065160/{z}/{x}/{y}{r}.png?access-token=DlhBoBAQ7W9tmNM3WyILidXnRRcK7tnABIcRmeHaWKp1lz9SHyloTWRA9gPcDKP3"
        />
        
        <LayersControl position="bottomright" >
          <LayersControl.Overlay name="Regije">
            <GeoJsonController type={'RG'} leto={leto} handleHoveredLayerChange={handleHoveredLayerChange} ref={regijeGeoRef} />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Občine">
            <GeoJsonController type={'OB'} leto={leto} handleHoveredLayerChange={handleHoveredLayerChange} ref={obcineGeoRef} />
          </LayersControl.Overlay>
        </LayersControl>

        <ZoomControl position="bottomright" />

        <MapInfo hoveredLayer={hoveredLayer} leto={leto}>
        </MapInfo>

        <Legend />

      </MapContainer>

      <div className="slider">
        <Slider
          defaultValue={2023}
          min={2009}
          max={2023}
          marks={{ 2009: 2009, 2023: 2023 }}
          dots
          trackStyle={{ backgroundColor: 'gray', height: 12, width: 110, marginTop: '-5px', borderColor: 'gray' }}
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
      </div>

      <NavigationPanel onSelectItem={handleSelectObcina} />
    </>
  );
}

export default MapComponent;
