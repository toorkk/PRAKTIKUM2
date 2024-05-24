import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet'
import ObcineGeo from '../../data/OBCINE.json'
import RegijeGeo from '../../data/SR.json'

import ReactSlider from 'react-slider'

function MapComponent() {

  const [layer, setLayer] = useState('Regije');
  
  useEffect(() => {
    console.log('Current layer:', layer);
  }, [layer]);

  function MapInnard() {
    const map = useMapEvents(
      {zoomend: () => {
      if(map.getZoom() > 9){
        setLayer('Obcine');
      }
      else{   
        setLayer('Regije');
      }
    }})
  };

  function onEach(feature, layer){

      if(feature.properties.ENOTA == "SR"){
        let popupContent =
        "<pre>" +
        "Statistična regija \n" +
        "<b>" + feature.properties.SR_UIME + "</b> \n" +
        "Površina: " + feature.properties.POV_KM2 + " km² \n" +
        "</pre>";
        layer.bindPopup(popupContent);
      } 
      else{
        let popupContent =
        "<pre>" +
        "Občina \n" +
        "<b>" + feature.properties.OB_UIME + "</b> \n" +
        "Površina: " + feature.properties.POV_KM2 + " km² \n" +
        "</pre>";
        layer.bindPopup(popupContent);
      }
  };

  return (
    <>

      <MapContainer id='map' center={[46.07118, 15.6]} zoom={8} scrollWheelZoom={true} placeholder={<h1>MAPA SE NALAGA, MOGOČE MORATE OMOGOČITI JAVASCRIPT</h1>}>
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/27bb4850-08f0-424e-808a-c9e1a2065160/{z}/{x}/{y}{r}.png?access-token=DlhBoBAQ7W9tmNM3WyILidXnRRcK7tnABIcRmeHaWKp1lz9SHyloTWRA9gPcDKP3"
        />
        
        <MapInnard setLayer={setLayer} />
        {layer === 'Obcine' && (
          <GeoJSON data={ObcineGeo} attribution="&copy; Štefan Baebler" style={{ weight: 2, color: "green" }} onEachFeature={onEach} />
        )}
        {layer === 'Regije' && (
          <GeoJSON data={RegijeGeo} attribution="&copy; Štefan Baebler" style={{ weight: 2, color: "green"  }} onEachFeature={onEach}/>
        )}
      </MapContainer>

    </>
  )
}

export default MapComponent;
