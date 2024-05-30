import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Chart from 'chart.js/auto';
import { useState, useEffect, useRef } from 'react';

import ObcineGeo from '../../data/OBCINE.json';
import PlacaGeo from '../../data/povpPlaca.json';
import Podatki from '../../data/Podatki.json';

function PresekComponent() {
  const [modifiedGeoJSON, setModifiedGeoJSON] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2023);
  const chartRef = useRef(null);

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
  const handlePopupOpen = (feature) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const data = {
      labels: Object.keys(feature.properties.payData),
      datasets: [
        {
          label: 'Indeks plače',
          data: Object.values(feature.properties.payData),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Migracijski indeks',
          data: Object.values(feature.properties.migrationData),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
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
            style={{ color: 'blue', weight: 1, opacity: 0.5 }}
            onEachFeature={(feature, layer) => {
              let popupContent = `<strong>Občina:</strong> ${feature.properties.OB_UIME}<br/>`;
              popupContent +=
                '<canvas id="myChart" width="400" height="400"></canvas>';
              layer.bindPopup(popupContent);

              layer.on('popupopen', () => {
                handlePopupOpen(feature);
              });
            }}
          />
        )}
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
