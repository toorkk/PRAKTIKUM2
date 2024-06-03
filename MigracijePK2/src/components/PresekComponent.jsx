import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import Slider from 'rc-slider';
import { Line } from 'react-chartjs-2';
import 'rc-slider/assets/index.css';
import 'chart.js/auto';

import ObcineGeo from '../../data/OBCINE.json';
import PlacaGeo from '../../data/povpPlaca.json';
import Podatki from '../../data/Podatki.json';

function PresekComponent() {
  const [modifiedGeoJSON, setModifiedGeoJSON] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [payWeight, setPayWeight] = useState(0.5);
  const [migrationWeight, setMigrationWeight] = useState(0.5);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedRegion, setSelectedRegion] = useState(null);

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

  const updateChartData = (regionData) => {
    if (!regionData) return;

    const labels = [];
    const payData = [];
    const migrationData = [];

    Object.keys(regionData.payData).forEach((year) => {
      labels.push(year);
      payData.push(regionData.payData[year]);
      migrationData.push(regionData.migrationData[year] || 0);
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Indeks plače',
          data: payData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
        {
          label: 'Indeks delovne migracije',
          data: migrationData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
      ],
    });
  };

  const getFillColor = (pay, migration) => {
    const combinedIndex = pay * payWeight + migration * migrationWeight;
    const normalizedValue = (combinedIndex / 200) * 100;

    let fillColor;
    if (normalizedValue >= 80) fillColor = '#800026';
    else if (normalizedValue >= 60) fillColor = '#BD0026';
    else if (normalizedValue >= 40) fillColor = '#E31A1C';
    else if (normalizedValue >= 20) fillColor = '#FC4E2A';
    else fillColor = '#FFEDA0';

    return fillColor;
  };

  const onEachFeature = (feature, layer) => {
    let popupContent = `<strong>Občina:</strong> ${feature.properties.OB_UIME}<br/>`;
    Object.keys(feature.properties.payData).forEach((year) => {
      popupContent += `<strong>${year}:</strong><br/> Indeks plače: ${
        feature.properties.payData[year] || 'No data'
      }<br/> Migracijski indeks: ${
        feature.properties.migrationData[year] || 'No data'
      }<br/>`;
    });
    layer.bindPopup(popupContent);

    layer.on({
      click: () => {
        setSelectedRegion(feature.properties);
        updateChartData(feature.properties);
      },
    });
  };

  const handleRegionChange = (event) => {
    const regionName = event.target.value;
    const region = modifiedGeoJSON.features.find(
      (feature) => feature.properties.OB_UIME === regionName
    );
    setSelectedRegion(region.properties);
    updateChartData(region.properties);
  };

  return (
    <div>
      <div>
        <h4>Izberi leto: {selectedYear}</h4>
        <Slider
          min={2009}
          max={2023}
          value={selectedYear}
          onChange={setSelectedYear}
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
      <div>
        <h4>Izberi regijo:</h4>
        <select
          onChange={handleRegionChange}
          value={selectedRegion ? selectedRegion.OB_UIME : ''}
        >
          <option value="" disabled>
            Select a region
          </option>
          {modifiedGeoJSON &&
            modifiedGeoJSON.features.map((feature) => (
              <option
                key={feature.properties.OB_ID}
                value={feature.properties.OB_UIME}
              >
                {feature.properties.OB_UIME}
              </option>
            ))}
        </select>
      </div>
      <MapContainer
        center={[46.07118, 14.8]}
        zoom={7.5}
        scrollWheelZoom={true}
        style={{ height: '75vh', width: '100%' }}
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
              return {
                color: 'white',
                weight: 1,
                opacity: 0.7,
                fillColor: getFillColor(pay, migration),
                fillOpacity: 0.7,
              };
            }}
            onEachFeature={onEachFeature}
          />
        )}
        <div className="info legend">
          <div>
            <i style={{ background: '#800026' }}></i> 80 - 100
          </div>
          <div>
            <i style={{ background: '#BD0026' }}></i> 60 - 79
          </div>
          <div>
            <i style={{ background: '#E31A1C' }}></i> 40 - 59
          </div>
          <div>
            <i style={{ background: '#FC4E2A' }}></i> 20 - 39
          </div>
          <div>
            <i style={{ background: '#FFEDA0' }}></i> 0 - 19
          </div>
        </div>
      </MapContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h4>Teža indeksa plače: {payWeight}</h4>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={payWeight}
            onChange={setPayWeight}
            marks={{ 0: '0', 1: '1' }}
          />
        </div>
        <div>
          <h4>Teža migracijskega indeksa: {migrationWeight}</h4>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={migrationWeight}
            onChange={setMigrationWeight}
            marks={{ 0: '0', 1: '1' }}
          />
        </div>
      </div>
      {selectedRegion && (
        <div>
          <h4>{selectedRegion.OB_UIME} - Indeks delovne migracije in plače</h4>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default PresekComponent;
