import React from 'react';
import { GeoJSON } from 'react-leaflet';

import stringSimilarity from 'string-similarity';

import ObcineGeo from '../../data/OBCINE.json';
import RegijeGeo from '../../data/SR.json';
import PodatkiObcine from '../../data/Podatki_vredi.json';
import PodatkiRegije from '../../data/Regije_vredi.json';
import AllData from '../../data/AllData2023.json';

const GeoJsonControllerBackup = React.memo(
  ({ type, leto, handleHoveredLayerChange }) => {
    let data;
    if (type == 'RG') data = RegijeGeo;
    else if (type == 'OB') data = ObcineGeo;

    const highlightFeature = (e) => {
      const layer = e.target;

      layer.setStyle({
        weight: 3,
        color: '#F2F3F4',
        dashArray: '',
      });

      layer.bringToFront();
      if (layer.feature.properties.ENOTA == 'OB') {
        let closestMatch = findClosestMatch(layer.feature.properties.OB_UIME);
        handleHoveredLayerChange(closestMatch);
      } else if (layer.feature.properties.ENOTA == 'SR') {
        handleHoveredLayerChange({
          name: layer.feature.properties.SR_UIME,
          data: findRegijaData(layer.feature.properties.SR_UIME),
        });
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

      if (feature.properties.ENOTA === 'SR') {
        const regijaName = feature.properties.SR_UIME;
        const regijaData = findRegijaData(regijaName);

        let popupContent = `<pre>Statistična regija\n<b>${regijaName}</b>\n`;
        if (regijaData) {
          for (let year = 2009; year <= 2023; year++) {
            popupContent += `${year}: ${regijaData[year] || 'N/A'}\n`;
          }
        } else {
          popupContent += 'No data available';
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
          popupContent += 'No data available';
        }
        popupContent += `Površina: ${feature.properties.POV_KM2} km²\n</pre>`;
        popupContent +=
          '<a href="http://localhost:5173/podrobnosti/' +
          feature.properties.OB_UIME +
          '/2023' +
          '">PODROBNOSTI</a>';
        layer.bindPopup(popupContent);
      }
    }

    function findClosestMatch(name) {
      let closestMatch = null;
      let maxMatch = -1;

      PodatkiObcine.forEach((obcina) => {
        const similarity = stringSimilarity.compareTwoStrings(
          name,
          obcina.Občine
        );
        if (similarity > maxMatch) {
          maxMatch = similarity;
          closestMatch = { name: obcina.Občine, data: obcina };
        }
      });

      return closestMatch;
    }

    function findRegijaData(name) {
      return PodatkiRegije.find((regija) => regija.Regije === name);
    }

    function setGeoStyle(properties) {
      let value;

      if (properties.properties.ENOTA === 'OB') {
        let closestMatch = findClosestMatch(properties.properties.OB_UIME);
        value = closestMatch.data[leto];
      } else if (properties.properties.ENOTA === 'SR') {
        value = findRegijaData(properties.properties.SR_UIME);
        value = value[leto];
      }

      let colors = [
        '#006400',
        '#1C7204',
        '#388108',
        '#538F0D',
        '#6F9D11',
        '#8BAC15',
        '#A7BA19',
        '#C2C81E',
        '#DED722',
        '#FAE526',
      ];

      function getColor(d) {
        return d > 165
          ? colors[0]
          : d > 135
          ? colors[1]
          : d > 115
          ? colors[2]
          : d > 100
          ? colors[3]
          : d > 90
          ? colors[4]
          : d > 75
          ? colors[5]
          : d > 60
          ? colors[6]
          : d > 45
          ? colors[7]
          : d > 30
          ? colors[8]
          : d > 0
          ? colors[9]
          : '#8C8C8C';
      }

      return {
        weight: 2,
        color: 'gray',
        dashArray: 3,
        fillColor: getColor(value),
        fillOpacity: 0.65,
      };
    }

    return (
      <GeoJSON
        data={data}
        attribution="&copy; Štefan Baebler"
        style={setGeoStyle}
        onEachFeature={onEach}
      />
    );
  }
);
GeoJsonControllerBackup.displayName = 'GeoJsonControllerBackup';

export default GeoJsonControllerBackup;
