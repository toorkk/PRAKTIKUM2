import React, { forwardRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import stringSimilarity from 'string-similarity';
import ChartJS from 'chart.js/auto';
import ObcineGeo from '../../data/OBCINE.json';
import RegijeGeo from '../../data/SR.json';
import MergedData from '../../data/Merged18_23.json';
import PodatkiObcine from '../../data/Podatki_vredi.json';
import PodatkiRegije from '../../data/Regije_vredi.json';
import './GeoJsonControllerStyle.css';

const GeoJsonController = forwardRef(
  ({ type, leto, handleHoveredLayerChange }, ref) => {
    let data;
    if (type === 'RG') data = RegijeGeo;
    else if (type === 'OB') data = ObcineGeo;

    let currentOpenInfoBox = null;
    const getRegionChartData = (regijaName) => {
      const regijaData = findRegijaData(regijaName);

      if (!regijaData) return null;

      const years = [2018, 2019, 2020, 2021, 2022, 2023];

      const indLmgrData = years.map((year) =>
        parseFloat(regijaData[year] || 0)
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
        ],
      };
    };
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
    let regionChartInstance;

    const renderRegionChart = (canvas, data) => {
      if (regionChartInstance) {
        regionChartInstance.destroy();
      }
      regionChartInstance = new ChartJS(canvas, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Leto',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Indeks',
              },
            },
          },
        },
      });
    };
    const onEach = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });

      if (feature.properties.ENOTA === 'SR') {
        const regijaName = feature.properties.SR_UIME;

        let popupContent = `<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #333; width: 100%;"><pre>Statistična regija\n<b style="font-weight: bold; color: #2c3e50;">${regijaName}</b>\n`;
        popupContent += `Površina: ${feature.properties.POV_KM2} km²\n</pre></div>`;
        popupContent += `<div id="region-chart-${regijaName}" style="margin-top: 10px;">
        <canvas id="region-chart-canvas-${regijaName}" width="400" height="300"></canvas>
      </div>`;
        layer.bindPopup(popupContent);
        layer.on('popupopen', () => {
          setTimeout(() => {
            const canvas = document.getElementById(
              `region-chart-canvas-${regijaName}`
            );
            if (canvas) {
              const regionChartData = getRegionChartData(regijaName);
              renderRegionChart(canvas, regionChartData);
            }
          }, 0);
        });
      } else if (feature.properties.ENOTA === 'OB') {
        const obcinaName = feature.properties.OB_UIME;
        const closestMatch = findClosestMatch(obcinaName);
        const getYearlyData = (data) => {
          if (!data) return 'No data available';
          let yearlyData = '';
          for (let year = 2018; year <= 2023; year++) {
            yearlyData += `${year}: ${data[year] || 'N/A'}\n`;
          }
          return yearlyData;
        };
        let popupContent = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1; color: #333; display: flex; justify-content: space-between; align-items: center; width: 100%;">
  <div>
    <h3>Občina</h3>
    <b style="font-weight: bold; color: #808080;">
      <h6>${closestMatch.name}</h6>
    </b>
  </div>
  <div>
    <a href="./podrobnosti/${feature.properties.OB_UIME}/2023" class="btn btn-outline-success custom-btn">
      PODROBNOSTI
    </a>
  </div>
</div>` + `</b>
          <div id="additional-chart-${obcinaName}" style="margin-top: 10px;">
            <canvas id="additional-chart-canvas-${obcinaName}" width="300" height="200"></canvas>
          </div>
          <div id="additional-chart-notri-vuni-${obcinaName}" style="margin-top: 10px;">
            <canvas id="additional-chart-notri-vuni-canvas-${obcinaName}" width="300" height="200"></canvas>
          </div>
          <div id="more-info-${obcinaName}" style="display: none; margin-top: 10px;">
            <pre>${getYearlyData(closestMatch.data)}</pre>
          </div>
        </div>`;

        
        const chartId = `chart-${feature.properties.OB_UIME}`;
        const dropdownId = `dropdown-${feature.properties.OB_UIME}`;
        popupContent += `<div class="graph-icon" style="position: relative; display: flex; justify-content: center; align-items: center; margin-top: 10px;">
        <hr style="width: 100%; border: 0; border-top: 2px solid #000000; margin: 0; position: absolute; top: 50%; transform: translateY(-50%); z-index: 0;">
<span id="toggle-icon-${chartId}" class="fas fa-chart-line" style="position: relative; z-index: 1; cursor: pointer; font-size: 20px; color: #ffffff; border-radius: 5px; padding: 5px; background-color: grey;">▼
</span>
      </div>`;

        popupContent += `<div class="chart-container" id="container-${chartId}" style="width: 100%; height: 0; overflow: hidden; transition: height 0.3s ease-out;"><div class="dropdown-container" style="margin-top: 5px;">
        <label for="${dropdownId}"></label>
        <select id="${dropdownId}" class="custom-dropdown" style="padding: 5px; font-size: 12px;">
          <option value="main" class="main-option">Korelacija plače z mig. indeksom</option>
          <option value="chart1"class="chart1-option">Korelacija povprečne starosti z mig. indeksom</option>
          <option value="chart2"class="chart2-option">Korelacija indeksa povprečne starosti migracije</option>
          <option value="chart3"class="chart3-option">Korelacija Koeficienta starostne odvisnosti</option>
        </select>
      </div><canvas id="${chartId}"></canvas>                           <label for="${dropdownId}"></label>
        <select id="${dropdownId}" class="custom-dropdown" style="padding: 5px; font-size: 12px;">
          <option value="main" class="main-option">Korelacija plače z mig. indeksom</option>
          <option value="chart1"class="chart1-option">Korelacija povprečne starosti z mig. indeksom</option>
          <option value="chart2"class="chart2-option">Korelacija indeksa povprečne starosti migracije</option>
          <option value="chart3"class="chart3-option">Korelacija Koeficienta starostne odvisnosti</option>
        </select></div></div>`;

        popupContent += `<div style="display: flex; justify-content: space-between; margin-top: 10px;">
                           <div id="info-box-1" class="fa fa-info-circle" style="background-color: #FFD700; padding: 10px; margin: 5px; cursor: pointer; flex: 1; text-align: center; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                             <FontAwesomeIcon icon={faQuestionCircle} style="margin-right: 5px;" />
                           </div>
                           <div id="info-box-2" class="fa fa-info-circle" style="background-color: #ADFF2F; padding: 10px; margin: 5px; cursor: pointer; flex: 1; text-align: center; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                             <FontAwesomeIcon icon={faQuestionCircle} style="margin-right: 5px;" />
                           </div>
                           <div id="info-box-3" class="fa fa-info-circle" style="background-color: #00BFFF; padding: 10px; margin: 5px; cursor: pointer; flex: 1; text-align: center; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                             <FontAwesomeIcon icon={faQuestionCircle} style="margin-right: 5px;" />
                           </div>
                           <div id="info-box-4" class="fa fa-info-circle" style="background-color: #FF6347; padding: 10px; margin: 5px; cursor: pointer; flex: 1; text-align: center; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                             <FontAwesomeIcon icon={faQuestionCircle} style="margin-right: 5px;" />
                           </div>
                         </div>`;

        popupContent += `<div id="info-detail-1" style="display: none; margin-top: 10px;"><h3>Korelacija plače z mig. indeksom</h3>Graf korelacije indeksa plače z migracijskim indeksom prikazuje povezavo med povprečno višino plače v določeni občini in stopnjo migracije delovne sile v to občino ali iz nje.</div>`;
        popupContent += `<div id="info-detail-2" style="display: none; margin-top: 10px;"><h3>Korelacija povprečne starosti z mig. indeksom</h3>Graf korelacije povprečne starosti z migracijskim indeksom prikazuje povezavo med povprečno starostjo prebivalcev določene občine in stopnjo migracije delovne sile v to občino ali iz nje.</div>`;
        popupContent += `<div id="info-detail-3" style="display: none; margin-top: 10px;"><h3>Korelacija indeksa povprečne starosti migracije</h3>Graf korelacije med indeksom povprečne migracijske starosti in indeksom delovne migracije prikazuje povezavo med povprečno starostjo ljudi, ki se selijo v določeno občino ali iz nje, in stopnjo delovne migracije v tej občini.</div>`;
        popupContent += `<div id="info-detail-4" style="display: none; margin-top: 10px;"><h3>Korelacija Koeficienta starostne odvisnosti</h3>Koeficient starostne odvisnosti starih je razmerje med številom starejših (65 let ali več) in številom delovno sposobnih prebivalcev, torej prebivalcev, starih 15 do 64 let, pomnoženo s 100.</div>`;

        popupContent += `</div>`;

        var popup = L.popup({
          closeOnClick: false
        })
        .setContent(popupContent);
        
        layer.bindPopup(popup);

        let chartInstance;
        let additionalChartInstance;

        const renderSelectedChart = (canvas, selectedValue) => {
          if (chartInstance) {
            chartInstance.destroy();
          }

          let chartData;
          if (selectedValue === 'main') {
            chartData = getChartData(closestMatch.name);
          } else if (selectedValue === 'chart1') {
            chartData = getNewChartDataOne(closestMatch.name);
          } else if (selectedValue === 'chart2') {
            chartData = getNewChartDataTwo(closestMatch.name);
          } else if (selectedValue === 'chart3') {
            chartData = getNewChartDataThree(closestMatch.name);
          }
          chartInstance = new ChartJS(canvas, {
            type: 'line',
            data: chartData,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Leto',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Indeks',
                  },
                },
              },
            },
          });
        };

        const renderAdditionalChart = (canvas, data) => {
          if (additionalChartInstance) {
            additionalChartInstance.destroy();
          }
          additionalChartInstance = new ChartJS(canvas, {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Leto',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Indeks',
                  },
                },
              },
            },
          });
        };
        let additionalChartNotriVuniInstance;

        const renderAdditionalChartNotriVuni = (canvas, data) => {
          if (additionalChartNotriVuniInstance) {
            additionalChartNotriVuniInstance.destroy();
          }
          additionalChartNotriVuniInstance = new ChartJS(canvas, {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Leto',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Indeks',
                  },
                },
              },
            },
          });
        };

        layer.on('popupopen', () => {
          const additionalCanvas = document.getElementById(
            `additional-chart-canvas-${obcinaName}`
          );
          const additionalChartData = getAdditionalChartData(closestMatch.name);
          renderAdditionalChart(additionalCanvas, additionalChartData);

          const additionalCanvasNotriVuni = document.getElementById(
            `additional-chart-notri-vuni-canvas-${obcinaName}`
          );
          const additionalChartNotriVuniData = getAdditionalChartNotriVuniData(
            closestMatch.name
          );
          renderAdditionalChartNotriVuni(
            additionalCanvasNotriVuni,
            additionalChartNotriVuniData
          );

          const canvas = document.getElementById(chartId);
          const dropdown = document.getElementById(dropdownId);
          const toggleIcon = document.getElementById(`toggle-icon-${chartId}`);
          const container = document.getElementById(`container-${chartId}`);
          const showMoreBtn = document.getElementById(
            `show-more-btn-${obcinaName}`
          );
          const moreInfoDiv = document.getElementById(
            `more-info-${obcinaName}`
          );
          if (dropdown) {
            dropdown.addEventListener('change', (event) => {
              renderSelectedChart(canvas, event.target.value);
            });
          }

          if (toggleIcon) {
            toggleIcon.addEventListener('click', () => {
              if (
                container.style.height === '0px' ||
                container.style.height === ''
              ) {
                container.style.height = '350px';
                container.style.paddingBottom = '30px';
                renderSelectedChart(canvas, dropdown.value);
              } else {
                container.style.height = '0px';
                container.style.paddingBottom = '0px';

              }
            });
          }

          layer.on('popupopen', () => {
            const canvas = document.getElementById(`chart-${obcinaName}`);
            renderSelectedChart(canvas, closestMatch.name);

            const showMoreBtn = document.getElementById(
              `show-more-btn-${obcinaName}`
            );
            const moreInfoDiv = document.getElementById(
              `more-info-${obcinaName}`
            );

            showMoreBtn.addEventListener('click', () => {
              if (moreInfoDiv.style.display === 'none') {
                moreInfoDiv.style.display = 'block';
                showMoreBtn.textContent = 'Show less';
              } else {
                moreInfoDiv.style.display = 'none';
                showMoreBtn.textContent = 'Show more';
              }
            });
          });

          const infoBoxes = document.querySelectorAll('.fa-info-circle');
          infoBoxes.forEach((box) => {
            box.addEventListener('click', () => {
              if (currentOpenInfoBox && currentOpenInfoBox !== box) {
                const currentDetail = document.getElementById(
                  `info-detail-${currentOpenInfoBox.id.split('-')[2]}`
                );
                currentDetail.style.display = 'none';
              }

              const detail = document.getElementById(
                `info-detail-${box.id.split('-')[2]}`
              );
              detail.style.display =
                detail.style.display === 'none' ? 'block' : 'none';
              currentOpenInfoBox = box;
            });
          });

          renderSelectedChart(canvas, 'main');
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
    const getAdditionalChartNotriVuniData = (obcinaName) => {
      const obcinaData = PodatkiObcine.find(
        (item) => item.Občine === obcinaName
      );

      if (!obcinaData) return null;

      const years = [2018, 2019, 2020, 2021, 2022, 2023];
      const zunaj = years.map((year) => year + '.3');
      const notri = years.map((year) => year + '.6');

      return {
        labels: years,
        datasets: [
          {
            label: 'Delavci, znotraj občine',
            data: notri.map((year) => obcinaData[year]),
            fill: false,
            backgroundColor: 'rgb(234, 236, 14)',
            borderColor: 'rgb(234, 236, 14)',
          },
          {
            label: 'Delavci zunaj občine',
            data: zunaj.map((year) => obcinaData[year]),
            fill: false,
            backgroundColor: 'rgb(254, 171, 14)',
            borderColor: 'rgb(254, 171, 14)',
          },
        ],
      };
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
            label: 'Povprečna starost',
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
            label: 'Indeks povprečne starosti migracije',
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
            label: 'Starostna odvisnost',
            data: ageDpndData,
            borderColor: 'rgb(255, 165, 0)',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            fill: false,
          },
        ],
      };
    };

    const getAdditionalChartData = (obcinaName) => {
      const obcinaData = PodatkiObcine.find(
        (item) => item.Občine === obcinaName
      );

      if (!obcinaData) return null;

      const years = [2018, 2019, 2020, 2021, 2022, 2023];

      const indLmgrData = years.map((year) => parseFloat(obcinaData[year]));
      const indLmgrMData = years.map((year) =>
        parseFloat(obcinaData[year + '.1'])
      );
      const indLmgrFData = years.map((year) =>
        parseFloat(obcinaData[year + '.2'])
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
            label: 'Indeks delovne migracije (moški)',
            data: indLmgrMData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
          },
          {
            label: 'Indeks delovne migracije (ženske)',
            data: indLmgrFData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
          },
        ],
      };
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
        ref={ref}
      />
    );
  }
);
GeoJsonController.displayName = 'GeoJsonController';

export default React.memo(GeoJsonController);
