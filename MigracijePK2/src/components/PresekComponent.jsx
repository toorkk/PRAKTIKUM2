import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import chroma from 'chroma-js';

import ObcineGeo from '../../data/OBCINE.json';
import PlacaGeo from '../../data/povpPlaca.json';
import Podatki from '../../data/Podatki.json';

function PresekComponent() {
  const [modifiedGeoJSON, setModifiedGeoJSON] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2023);

  useEffect(() => {
    const integrateData = () => {
      const salaryMap = PlacaGeo.data.reduce((acc, item) => {
        const obcinaID = parseInt(item.key[0]);
        const year = item.key[1];
        if (!acc[obcinaID]) acc[obcinaID] = {};
        acc[obcinaID][year] = parseFloat(item.values[0]);
        return acc;
      }, {});

      const migrationMap = Podatki.reduce((acc, item) => {
        const obcinaID = item.Občine;
        Object.keys(item).forEach((year) => {
          if (year !== 'Občine') {
            if (!acc[obcinaID]) acc[obcinaID] = {};
            acc[obcinaID][year] = parseFloat(item[year]);
          }
        });
        return acc;
      }, {});

      return ObcineGeo.features.map((feature) => {
        const obcinaID = feature.properties.OB_ID.toString();
        const obcinaIDX = feature.properties.OB_UIME.toString();
        return {
          ...feature,
          properties: {
            ...feature.properties,
            payData: salaryMap[obcinaID] || {},
            migrationData: migrationMap[obcinaIDX] || {},
          },
        };
      });
    };

    const updatedGeoJSON = {
      ...ObcineGeo,
      features: integrateData(),
    };

    setModifiedGeoJSON(updatedGeoJSON);
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };
  const getBlendedColor = (pay, migration) => {
    const payColorScale = chroma.scale(['#ffffff', '#003700']).colors(17);
    const migrationColorScale = chroma.scale(['#ffffff', '#ff0000']).colors(17);

    const payIndex = Math.min(
      Math.floor((pay / 2000) * payColorScale.length),
      payColorScale.length - 1
    );
    const migrationIndex = Math.min(
      Math.floor((migration / 200) * migrationColorScale.length),
      migrationColorScale.length - 1
    );

    const payColor = chroma(payColorScale[payIndex]).rgba();
    const migrationColor = chroma(migrationColorScale[migrationIndex]).rgba();

    const blendedColor = chroma
      .mix(
        payColor,
        migrationColor,
        payWeight / (payWeight + migrationWeight),
        'rgb'
      )
      .hex();

    return blendedColor;
  };

  return (
    <div>
      <MapContainer
        center={[46.07118, 14.8]}
        zoom={8.5}
        scrollWheelZoom={true}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {modifiedGeoJSON && (
          <GeoJSON
            data={modifiedGeoJSON}
            style={(feature) => {
              const pay = feature.properties.payData[selectedYear] || 0;
              const migration =
                feature.properties.migrationData[selectedYear] || 0;
              const fillColor = getBlendedColor(pay, migration);

              return {
                color: 'white',
                weight: 1,
                opacity: 0.7,
                fillColor,
                fillOpacity: 0.7,
              };
            }}
            onEachFeature={(feature, layer) => {
              let popupContent = `<strong>Občina:</strong> ${feature.properties.OB_UIME}<br/>`;
              Object.keys(feature.properties.payData).forEach((year) => {
                popupContent += `<strong>${year}:</strong><br/> Indeks plače: ${
                  feature.properties.payData[year] || 'No data'
                }<br/> Migracijski indeks: ${
                  feature.properties.migrationData[year] || 'No data'
                }<br/>`;
              });
              layer.bindPopup(popupContent);
            }}
          />
        )}
        <div
          className="legend"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <strong>Legenda</strong>
          <br />
          <div>
            <span
              style={{
                backgroundColor: '#003700',
                display: 'inline-block',
                width: '20px',
                height: '20px',
              }}
            ></span>{' '}
            Indeks plače
          </div>
          <div>
            <span
              style={{
                backgroundColor: '#ff0000',
                display: 'inline-block',
                width: '20px',
                height: '20px',
              }}
            ></span>{' '}
            Migracijski indeks
          </div>
          <div>
            <span
              style={{
                backgroundColor: '#800080',
                display: 'inline-block',
                width: '20px',
                height: '20px',
              }}
            ></span>{' '}
            Kombiniran indeks
          </div>
        </div>
      </MapContainer>
      <div style={{ padding: '10px' }}>
        <Slider
          min={2009}
          max={2023}
          value={selectedYear}
          onChange={handleYearChange}
          marks={{
            2009: '2009',
            2010: '2010',
            2011: '2011',
            2012: '2012',
            2013: '2013',
            2014: '2014',
            2015: '2015',
            2016: '2016',
            2017: '2017',
            2018: '2018',
            2019: '2019',
            2020: '2020',
            2021: '2021',
            2022: '2022',
            2023: '2023',
          }}
        />
      </div>
    </div>
  );
}

export default PresekComponent;
