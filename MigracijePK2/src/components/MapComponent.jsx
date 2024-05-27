import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import ObcineGeo from '../../data/OBCINE.json';
import RegijeGeo from '../../data/SR.json';
import PodatkiObcine from '../../data/Podatki.json'; 
import PodatkiRegije from '../../data/Podatki_regija.json';
import stringSimilarity from 'string-similarity'; 
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  layer.bringToFront();
}

function MapComponent() {
  const [layer, setLayer] = useState('Regije');
  const [leto, setLeto] = useState('2023');
  
  useEffect(() => {
    console.log('Current layer:', layer);
  }, [layer]);

  function MapInnard() {
    const map = useMapEvents({
      zoomend: () => {
        if (map.getZoom() > 7) {
          setLayer('Obcine');
        } else {
          setLayer('Regije');
        }
      }
    });
  }

  function onEach(feature, layer) {
    if (feature.properties.ENOTA === "SR") {
      const regijaName = feature.properties.SR_UIME;
      const regijaData = findRegijaData(regijaName);
      
      let popupContent = `<pre>Statistična regija\n<b>${regijaName}</b>\n`;
      if (regijaData) {
        for (let year = 2009; year <= 2023; year++) {
          popupContent += `${year}: ${regijaData[year] || 'N/A'}\n`;
        }
      } else {
        popupContent += "No data available";
      }
      popupContent += `Površina: ${feature.properties.POV_KM2} km²\n</pre>`;
      layer.bindPopup(popupContent);
    } else {
      const obcinaName = feature.properties.OB_UIME;
      const closestMatch = findClosestMatch(obcinaName);
      
      let popupContent = `<pre>Občina\n<b>${closestMatch.name}</b>\n`;
      if (closestMatch.data) {
        for (let year = 2009; year <= 2023; year++) {
          popupContent += `${year}: ${closestMatch.data[year] || 'N/A'}\n`;
        }
      } else {
        popupContent += "No data available";
      }
      popupContent += `Površina: ${feature.properties.POV_KM2} km²\n</pre>`;
      layer.bindPopup(popupContent);
    }
  }

  function findClosestMatch(name) {
    let closestMatch = null;
    let maxMatch = -1;

    PodatkiObcine.forEach(obcina => {
      const similarity = stringSimilarity.compareTwoStrings(name, obcina.Občine);
      if (similarity > maxMatch) {
        maxMatch = similarity;
        closestMatch = { name: obcina.Občine, data: obcina };
      }
    });

    return closestMatch;
  }

  function findRegijaData(name) {
    return PodatkiRegije.find(regija => regija.Regije === name);
  }

  function afterSliderChanged(value) {
    setLeto(value);
  }

  function setGeoStyle(properties) {
    const closestMatch = findClosestMatch(properties.properties.OB_UIME);
    const value = closestMatch.data[leto];

    function getColor(d) {
      return d > 165  ? '#10451d' :
             d > 135  ? '#155d27' :
             d > 115  ? '#1a7431' :
             d > 100  ? '#208b3a' :
             d > 90   ? '#25a244' :
             d > 75   ? '#2dc653' :
             d > 60   ? '#4ad66d' :
             d > 45   ? '#6ede8a' :
             d > 30   ? '#92e6a7' :
             d > 0    ? '#b7efc5' :
                        '#8C8C8C';
    }

    return { weight: 2, color: "gray", dashArray: 3, fillColor: getColor(value), fillOpacity: 0.65 };
  }

  return (
    <>
      <MapContainer id='map' center={[46.07118, 15.6]} zoom={8} scrollWheelZoom={true} placeholder={<h1>MAPA SE NALAGA, MOGOČE MORATE OMOGOČITI JAVASCRIPT</h1>}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/27bb4850-08f0-424e-808a-c9e1a2065160/{z}/{x}/{y}{r}.png?access-token=DlhBoBAQ7W9tmNM3WyILidXnRRcK7tnABIcRmeHaWKp1lz9SHyloTWRA9gPcDKP3"
        />
        <MapInnard />
        {layer === 'Obcine' && (
          <GeoJSON data={ObcineGeo} attribution="&copy; Štefan Baebler" style={setGeoStyle} onEachFeature={onEach} />
        )}
        {layer === 'Regije' && (
          <GeoJSON data={RegijeGeo} attribution="&copy; Štefan Baebler" style={{ weight: 2, color: "green" }} onEachFeature={onEach} />
        )}
      </MapContainer>

      <div className="slider">
        <Slider
          defaultValue={2023}
          min={2009}
          max={2023}
          marks={{ 2009: 2009, 2023: 2023 }}
          trackStyle={{ backgroundColor: '#FFFFFF', height: 12, marginTop: '-4px' }}
          handleStyle={{ borderColor: "gray", backgroundColor: "#FFFFFF" }}
          onChange={afterSliderChanged}
        />
      </div>
    </>
  );
}

export default MapComponent;
