import React from 'react';
import { GeoJSON } from 'react-leaflet';
import stringSimilarity from 'string-similarity';
import ChartJS from 'chart.js/auto';

import ObcineGeo from '../../data/OBCINE.json';
import RegijeGeo from '../../data/SR.json';
import MergedData from '../../data/Merged18_23.json';

import PodatkiObcine from '../../data/Podatki_vredi.json';
import PodatkiRegije from '../../data/Regije_vredi.json';

const GeoJsonControllerBackupBackup = React.memo(
  ({ type, leto, handleHoveredLayerChange }) => {
    let data;
    if (type === 'RG') data = RegijeGeo;
    else if (type === 'OB') data = ObcineGeo;

    const highlightFeature = (e) => {
      const layer = e.target;
      layer.setStyle({
        weight: 3,
        color: '#F2F3F4',
        dashArray: '',
      });
      layer.bringToFront();
      if (layer.feature.properties.ENOTA === 'OB') {
        let closestMatch = findClosestMatch(layer.feature.properties.OB_UIME);
        handleHoveredLayerChange(closestMatch);
      } else if (layer.feature.properties.ENOTA === 'SR') {
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

    const onEach = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });

      if (feature.properties.ENOTA === 'SR') {
        const regijaName = feature.properties.SR_UIME;
        const regijaData = findRegijaData(regijaName);

        let popupContent = `<pre>Statistična regija\n<b>${regijaName}</b>\n`;
        if (regijaData) {
          for (let year = 2018; year <= 2023; year++) {
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
          for (let year = 2018; year <= 2023; year++) {
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

        const chartId = `chart-${feature.properties.OB_UIME}`;
        popupContent += `<div style="width: 100%; height: 400px;"><canvas id="${chartId}" style="width: 500px; height: 50%;"></canvas></div>`;

        const newChartIds = [
          `${chartId}-age-p`,
          `${chartId}-nmig-a`,
          `${chartId}-age-dpnd`,
        ];
        newChartIds.forEach((id) => {
          popupContent += `<div style="width: 100%; height: 400px;"><canvas id="${id}" style="width: 500px; height: 50%;"></canvas></div>`;
        });

        layer.bindPopup(popupContent);

        layer.on('popupopen', () => {
          const canvas = document.getElementById(chartId);
          if (canvas) {
            renderChart(canvas, getChartData(closestMatch.name));
          }
          newChartIds.forEach((id, index) => {
            const newData =
              index === 0
                ? getNewChartDataOne(closestMatch.name)
                : index === 1
                ? getNewChartDataTwo(closestMatch.name)
                : getNewChartDataThree(closestMatch.name);
            const newCanvas = document.getElementById(id);
            if (newCanvas) {
              renderNewChart(newCanvas, newData);
            }
          });
        });
      }
    };

    const getChartData = (obcinaName) => {
      const obcinaData = MergedData.find((item) => item.ob_ime === obcinaName);

      if (!obcinaData) return null;

      const years = [2018, 2019, 2020, 2021, 2022, 2023];

      const indLmgrData = years.map((year) =>
        parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
      );
      const indErnetData = years.map((year) =>
        parseFloat(obcinaData[`ind_ernet_${year}`] || 0)
      );

      return {
        labels: years,
        datasets: [
          {
            label: 'Indeks delovne migracije',
            data: indLmgrData,
            borderColor: 'rgb(0, 0, 255)',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            fill: false,
          },
          {
            label: 'Indeks plače',
            data: indErnetData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
          },
        ],
      };
    };

    const renderChart = (canvas, chartData) => {
      new ChartJS(canvas, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Index',
              },
            },
          },
        },
      });
    };

    const getNewChartDataOne = (obcinaName) => {
      const obcinaData = MergedData.find((item) => item.ob_ime === obcinaName);

      if (!obcinaData) return null;

      const years = [2018, 2019, 2020, 2021, 2022, 2023];

      const indLmgrData = years.map((year) =>
        parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
      );
      const agePData = years.map((year) =>
        parseFloat(obcinaData[`age_p_${year}`] || 0)
      );

      return {
        labels: years,
        datasets: [
          {
            label: 'Indeks delovne migracije',
            data: indLmgrData,
            borderColor: 'rgb(0, 128, 0)',
            backgroundColor: 'rgba(0, 128, 0, 0.2)',
            fill: false,
          },
          {
            label: 'Age Percentage',
            data: agePData,
            borderColor: 'rgb(255, 165, 0)',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            fill: false,
          },
        ],
      };
    };

    const getNewChartDataTwo = (obcinaName) => {
      const obcinaData = MergedData.find((item) => item.ob_ime === obcinaName);

      if (!obcinaData) return null;

      const years = [2018, 2019, 2020, 2021, 2022, 2023];

      const indLmgrData = years.map((year) =>
        parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
      );
      const nmigAData = years.map((year) =>
        parseFloat(obcinaData[`nmig_a_${year}`] || 0)
      );

      return {
        labels: years,
        datasets: [
          {
            label: 'Indeks delovne migracije',
            data: indLmgrData,
            borderColor: 'rgb(0, 128, 0)',
            backgroundColor: 'rgba(0, 128, 0, 0.2)',
            fill: false,
          },
          {
            label: 'Net Migration Age',
            data: nmigAData,
            borderColor: 'rgb(255, 165, 0)',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            fill: false,
          },
        ],
      };
    };

    const getNewChartDataThree = (obcinaName) => {
      const obcinaData = MergedData.find((item) => item.ob_ime === obcinaName);

      if (!obcinaData) return null;

      const years = [2018, 2019, 2020, 2021, 2022, 2023];

      const indLmgrData = years.map((year) =>
        parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
      );
      const ageDpndData = years.map((year) =>
        parseFloat(obcinaData[`age_dpnd_${year}`] || 0)
      );

      return {
        labels: years,
        datasets: [
          {
            label: 'Indeks delovne migracije',
            data: indLmgrData,
            borderColor: 'rgb(0, 128, 0)',
            backgroundColor: 'rgba(0, 128, 0, 0.2)',
            fill: false,
          },
          {
            label: 'Age Dependency Ratio',
            data: ageDpndData,
            borderColor: 'rgb(255, 165, 0)',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            fill: false,
          },
        ],
      };
    };

    const renderNewChart = (canvas, chartData) => {
      new ChartJS(canvas, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Index',
              },
            },
          },
        },
      });
    };

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
GeoJsonControllerBackupBackup.displayName = 'GeoJsonControllerBackupBackup';

export default GeoJsonControllerBackupBackup;
