import React, { useRef } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';

import stringSimilarity from 'string-similarity'; 

import ObcineGeo from '../../data/OBCINE.json';
import RegijeGeo from '../../data/SR.json';
import PodatkiObcine from '../../data/Podatki_vredi.json'; 
import PodatkiRegije from '../../data/Regije_vredi.json';

function GeoJsonController({type, leto, handleHoveredLayerChange}) {
    const map = useMap();

    console.log('reload2')
    let data;
    if(type == 'RG') data = RegijeGeo;
    else if (type == 'OB') data = ObcineGeo;
  
    const highlightFeature = (e) => {
      const layer = e.target;
      
      layer.setStyle({
        weight: 3,
        color: '#F2F3F4',
        dashArray: '',
        });

        layer.bringToFront();
        if(layer.feature.properties.ENOTA == 'OB'){
          let closestMatch = findClosestMatch(layer.feature.properties.OB_UIME)
          handleHoveredLayerChange(closestMatch);
        }
        else if(layer.feature.properties.ENOTA == 'SR'){
          handleHoveredLayerChange({name: layer.feature.properties.SR_UIME, data: findRegijaData(layer.feature.properties.SR_UIME)});
        }
    };
  
    const resetHighlight = (e) => {
        const layer = e.target;
  
        layer.setStyle({
          weight: 2,
          color: 'gray',
          dashArray: 3,
          });    
          };

    function onEach(feature, layer) {

        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
        });
    
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
          popupContent += '<a href="http://localhost:5173/podrobnosti/' + feature.properties.OB_UIME + '">PODROBNOSTI</a>';
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

    function setGeoStyle(properties) {
        let value;
    
        if(properties.properties.ENOTA === "OB"){
        let closestMatch = findClosestMatch(properties.properties.OB_UIME);
        value = closestMatch.data[leto];
        }
        else if(properties.properties.ENOTA === "SR"){
        value = findRegijaData(properties.properties.SR_UIME);
        value = value[leto];
        }
    
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
        <GeoJSON data={data} attribution="&copy; Štefan Baebler" style={setGeoStyle} onEachFeature={onEach} />
    );
  };

  export default GeoJsonController;