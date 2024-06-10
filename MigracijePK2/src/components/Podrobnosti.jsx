import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faMale,
  faFemale,
} from '@fortawesome/free-solid-svg-icons';
import stringSimilarity from 'string-similarity';
import './Podrobnosti.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import data from '../../data/Podatki_vredi.json';
import MergedData from '../../data/Merged18_23.json';
import '../Podrobnosti.css';
import { useParams } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Podrobnosti = () => {
  let { obcina, leto } = useParams();
  const [selectedObcina, setSelectedObcina] = useState(obcina);
  const [selectedYear, setSelectedYear] = useState(leto || '');
  const [selectedData, setSelectedData] = useState(null);
  const [grafIndeks, setGrafIndeks] = useState({ labels: [], datasets: [] });
  const [grafNotriVuni, setGrafNotriVuni] = useState({
    labels: [],
    datasets: [],
  });
  const [newChartData, setNewChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartOneData, setChartOneData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartTwoData, setChartTwoData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartThreeData, setChartThreeData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    let closestMatch = findClosestMatch(selectedObcina).name
    const dataItem = data.find((item) => item.Občine === closestMatch);
    setSelectedObcina(closestMatch);
    setSelectedData(dataItem);
    if (dataItem) {
      updateNewChartData(closestMatch);
      updateGrafIndeks(dataItem, selectedYear);
      updateGrafNotriVuni(dataItem, selectedYear);
      updateAdditionalCharts(closestMatch);
    }
  }, [selectedObcina, selectedYear]);

  const handleObcinaChange = (event) => {
    setSelectedObcina(event.target.value);
    setSelectedYear('');
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  function findClosestMatch(name) {
    let closestMatch = null;
    let maxMatch = -1;

    data.forEach((obcina) => {
      const similarity = stringSimilarity.compareTwoStrings(
        name,
        obcina.Občine
      );
      if (similarity > maxMatch) {
        maxMatch = similarity;
        closestMatch = { name: obcina.Občine };
      }
    });
    return closestMatch;
  }

  const updateGrafIndeks = (data, year) => {
    if (!data) return;
    const years = Object.keys(data).filter(
      (key) => key !== 'Občine' && !key.includes('.')
    );
    const moskiLeta = years.map((year) => year + '.1');
    const zenskeLeta = years.map((year) => year + '.2');

    setGrafIndeks({
      labels: years,
      datasets: [
        {
          label: 'Indeks delovne migracije',
          data: years.map((year) => data[year]),
          fill: false,
          backgroundColor: 'rgb(60, 179, 113)',
          borderColor: 'rgb(60, 179, 113)',
        },
        {
          label: 'Indeks delovne migracije (moški)',
          data: moskiLeta.map((year) => data[year]),
          fill: false,
          backgroundColor: 'rgb(0, 0, 255)',
          borderColor: 'rgb(0, 0, 255)',
        },
        {
          label: 'Indeks delovne migracije (ženske)',
          data: zenskeLeta.map((year) => data[year]),
          fill: false,
          backgroundColor: 'rgb(238, 130, 238)',
          borderColor: 'rgb(238, 130, 238)',
        },
      ],
    });
  };

  const updateGrafNotriVuni = (data, year) => {
    if (!data) return;
    const years = Object.keys(data).filter(
      (key) => key !== 'Občine' && !key.includes('.')
    );
    const zunaj = years.map((year) => year + '.3');
    const notri = years.map((year) => year + '.6');

    setGrafNotriVuni({
      labels: years,
      datasets: [
        {
          label: 'Delavci, znotraj občine',
          data: notri.map((year) => data[year]),
          fill: false,
          backgroundColor: 'rgb(234, 236, 14)',
          borderColor: 'rgb(234, 236, 14)',
        },
        {
          label: 'Delavci zunaj občine',
          data: zunaj.map((year) => data[year]),
          fill: false,
          backgroundColor: 'rgb(254, 171, 14)',
          borderColor: 'rgb(254, 171, 14)',
        },
      ],
    });
  };

  const updateNewChartData = (obcinaName) => {
    const obcinaData = MergedData.find((item) => item.ob_ime === obcinaName);

    if (!obcinaData) return;

    const years = [2018, 2019, 2020, 2021, 2022, 2023];
    const migrationData = years.map((year) =>
      parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
    );
    const payData = years.map((year) =>
      parseFloat(obcinaData[`ind_ernet_${year}`] || 0)
    );

    setNewChartData({
      labels: years,
      datasets: [
        {
          label: 'Indeks delovne migracije',
          data: migrationData,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          fill: false,
        },
        {
          label: 'Indeks plače',
          data: payData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
        },
      ],
    });
  };

  const updateAdditionalCharts = (obcinaName) => {
    const obcinaData = MergedData.find((item) => item.ob_ime === obcinaName);
    if (!obcinaData) return;

    const years = [2018, 2019, 2020, 2021, 2022, 2023];

    setChartOneData({
      labels: years,
      datasets: [
        {
          label: 'Indeks delovne migracije',
          data: years.map((year) =>
            parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
          ),
          borderColor: 'rgb(0, 128, 0)',
          backgroundColor: 'rgba(0, 128, 0, 0.2)',
          fill: false,
        },
        {
          label: 'Povprečna starost',
          data: years.map((year) =>
            parseFloat(obcinaData[`age_p_${year}`] || 0)
          ),
          borderColor: 'rgb(255, 165, 0)',
          backgroundColor: 'rgba(255, 165, 0, 0.2)',
          fill: false,
        },
      ],
    });

    setChartTwoData({
      labels: years,
      datasets: [
        {
          label: 'Indeks delovne migracije',
          data: years.map((year) =>
            parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
          ),
          borderColor: 'rgb(0, 128, 0)',
          backgroundColor: 'rgba(0, 128, 0, 0.2)',
          fill: false,
        },
        {
          label: 'Indeks povprečne starosti migracije',
          data: years.map((year) =>
            parseFloat(obcinaData[`nmig_a_${year}`] || 0)
          ),
          borderColor: 'rgb(255, 165, 0)',
          backgroundColor: 'rgba(255, 165, 0, 0.2)',
          fill: false,
        },
      ],
    });

    setChartThreeData({
      labels: years,
      datasets: [
        {
          label: 'Indeks delovne migracije',
          data: years.map((year) =>
            parseFloat(obcinaData[`ind_lmgr_${year}`] || 0)
          ),
          borderColor: 'rgb(0, 128, 0)',
          backgroundColor: 'rgba(0, 128, 0, 0.2)',
          fill: false,
        },
        {
          label: 'Starostna odvisnost',
          data: years.map((year) =>
            parseFloat(obcinaData[`age_dpnd_${year}`] || 0)
          ),
          borderColor: 'rgb(255, 165, 0)',
          backgroundColor: 'rgba(255, 165, 0, 0.2)',
          fill: false,
        },
      ],
    });
  };

  const years = selectedData
    ? Object.keys(selectedData).filter(
        (key) => key !== 'Občine' && !key.includes('.')
      )
    : [];
  const moskiLeta = selectedData ? years.map((year) => year + '.1') : [];
  const zenskeLeta = selectedData ? years.map((year) => year + '.2') : [];
  const zunaj = selectedData ? years.map((year) => year + '.3') : [];
  const notri = selectedData ? years.map((year) => year + '.6') : [];

  return (
    <div className="podrobnosti-container">
      <div
        className="obcina-selector"
        style={{ width: '50%', display: 'inline-block' }}
      >
        <label htmlFor="obcina">
          <em>Izberi občino: </em>
        </label>
        <select
          id="obcina"
          value={selectedObcina}
          onChange={handleObcinaChange}
        >
          {data
            .filter(
              (item) =>
                item['Občine'] !== 'Ime' && item['Občine'] !== 'SLOVENIJA'
            )
            .map((item) => (
              <option key={item.Občine} value={item.Občine}>
                {item.Občine}
              </option>
            ))}
        </select>
      </div>
      <div
        style={{
          width: '49%',
          display: 'inline-block',
          textAlign: 'end',
        }}
      >
        <button
          onClick={() => {
            window.location.href = '../../';
          }}
        >
          NAZAJ NA MAPO
        </button>
      </div>
      {selectedData && (
        <div className="obcina-box">
          <div className="left-box">
            <div className="obcina_name">
              <h2>{selectedObcina}</h2>
            </div>
            <div className="select_button">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                style={{ marginBottom: '10px' }}
              >
                <option value="">Izberi Leto</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="info-boxes">
              <div className="info-box">
                <div className="info-icon green-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {selectedData[selectedYear]}
                    </b>
                  </div>
                )}
                <div className="info-text">Indeks delovne migracije</div>
              </div>
              <div className="info-box">
                <div className="info-icon blue-icon">
                  <FontAwesomeIcon icon={faMale} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {selectedData[selectedYear + '.1']}
                    </b>
                  </div>
                )}
                <div className="info-text">
                  Indeks delovne migracije (moški)
                </div>
              </div>
              <div className="info-box">
                <div className="info-icon pink-icon">
                  <FontAwesomeIcon icon={faFemale} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {selectedData[selectedYear + '.2']}
                    </b>
                  </div>
                )}
                <div className="info-text">
                  Indeks delovne migracije (ženske)
                </div>
              </div>
              <Line data={grafIndeks} />
            </div>
          </div>
          <div className="right-box">
            <Line style={{ marginTop: '40px' }} data={grafNotriVuni} />
            <div className="additional-info-boxes">
              <div className="info-box">
                <div className="info-icon yellow-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {selectedData[selectedYear + '.6']}%
                    </b>
                  </div>
                )}
                <div className="info-text">
                  Delavci, ki delajo v občini prebivališča
                </div>
              </div>
              <div className="info-box">
                <div className="info-icon orange-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {selectedData[selectedYear + '.3']}%
                    </b>
                  </div>
                )}
                <div className="info-text">
                  Delavci, ki delajo zunaj občine prebivališča
                </div>
              </div>
            </div>
          </div>
          <div className="left-box">
            <h4>{selectedObcina} - Indeks delovne migracije in plače</h4>
            <Line data={newChartData} />
            <div className="additional-info-boxes">
              <div className="info-box">
                <div className="info-icon blue-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {selectedData[selectedYear]}
                    </b>
                  </div>
                )}
                <div className="info-text">Indeks delovne migracije</div>
              </div>
              <div className="info-box">
                <div className="info-icon pink-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <div>
                  {selectedYear && (
                    <div>
                      <b style={{ fontSize: '25px' }}>
                        {MergedData.find(
                          (item) => item.ob_ime === selectedObcina
                        )?.[`ind_ernet_${selectedYear}`] || 'N/A'}
                      </b>
                    </div>
                  )}
                </div>
                <div className="info-text">Indeks plače</div>
              </div>
            </div>
          </div>
          <div className="right-box">
            <h4>
              {selectedObcina} - Korelacija povprečne starosti z mig. indeksom
            </h4>
            <Line data={chartOneData} />
            <div className="additional-info-boxes">
              <div className="info-box">
                <div className="info-icon blue-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {MergedData.find(
                        (item) => item.ob_ime === selectedObcina
                      )?.[`age_p_${selectedYear}`] || 'N/A'}
                    </b>
                  </div>
                )}
                <div className="info-text">Povprečna starost</div>
              </div>
            </div>
          </div>
          <div className="left-box">
            <h4>
              {selectedObcina} - Korelacija indeksa povprečne starosti z mig.
              indeksom
            </h4>
            <Line data={chartTwoData} />
            <div className="additional-info-boxes">
              <div className="info-box">
                <div className="info-icon blue-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {MergedData.find(
                        (item) => item.ob_ime === selectedObcina
                      )?.[`nmig_a_${selectedYear}`] || 'N/A'}
                    </b>
                  </div>
                )}
                <div className="info-text">
                  Indeks povprečne starosti migracije
                </div>
              </div>
            </div>
          </div>
          <div className="right-box">
            <h4>
              {selectedObcina} - Korelacija indeksa starostne odvisnosti z mig.
              indeksom
            </h4>
            <Line data={chartThreeData} />
            <div className="additional-info-boxes">
              <div className="info-box">
                <div className="info-icon blue-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div>
                    <b style={{ fontSize: '25px' }}>
                      {MergedData.find(
                        (item) => item.ob_ime === selectedObcina
                      )?.[`age_dpnd_${selectedYear}`] || 'N/A'}
                    </b>
                  </div>
                )}
                <div className="info-text">Indeks starostne odvisnosti</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podrobnosti;
