import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faMale,
  faFemale,
} from '@fortawesome/free-solid-svg-icons';
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

import Podatki from '../../data/Podatki.json';
import AllData from '../../data/AllData2023.json';

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

  const [selectedObcina, setSelectedObcina] = useState(
    obcina || (data.length > 1 ? data[1].Občine : '')
  );
  const [selectedYear, setSelectedYear] = useState(leto || '');
  const [selectedData, setSelectedData] = useState(null);
  const [selectedPayData, setSelectedPayData] = useState(null);
  const [grafIndeks, setGrafIndeks] = useState({ labels: [], datasets: [] });
  const [grafNotriVuni, setGrafNotriVuni] = useState({
    labels: [],
    datasets: [],
  });
  const [newChartData, setNewChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const dataItem = data.find((item) => item.Občine === selectedObcina);
    const salaryMap = AllData.reduce((acc, item) => {
      const obcinaID = item.Občine;
      const year = item.LETO;
      if (!acc[obcinaID]) acc[obcinaID] = {};
      acc[obcinaID][year] = item.ind_ernet;
      return acc;
    }, {});
    setSelectedData(dataItem);
    setSelectedPayData(salaryMap);
    if (dataItem) {
      updateNewChartData(dataItem, salaryMap);
      updateGrafIndeks(dataItem, selectedYear);
      updateGrafNotriVuni(dataItem, selectedYear);
    }
  }, [selectedObcina, selectedYear]);

  const handleObcinaChange = (event) => {
    setSelectedObcina(event.target.value);
    setSelectedYear('');
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

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

  const updateNewChartData = (data, salaryMap) => {
    if (!data) return;
    const years = Object.keys(data).filter(
      (key) => key !== 'Občine' && !key.includes('.')
    );
    const labels = years;
    const migrationData = years.map((year) => data[year + '.1']);
    const payDataForObcina = salaryMap[selectedObcina] || {};

    console.log('Selected Pay Data:', selectedPayData);
    console.log('Pay Data for Obcina:', payDataForObcina);

    setNewChartData({
      labels,
      datasets: [
        {
          label: 'Indeks delovne migracije',
          data: migrationData,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
        },
        {
          label: 'Indeks plače',
          data: years.map((year) => payDataForObcina[year] || 0),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
        <label htmlFor="obcina">Izberi občino: </label>
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
      <div style={{ width: '49%', display: 'inline-block', textAlign: 'end' }}>
      <button onClick={() => {window.location.href='../../'}}>NAZAJ NA MAPO</button>
      </div>
      {selectedData && (
        <div className="obcina-box">
          <div className="left-box">
            <h2>{selectedObcina}</h2>
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
                  {selectedYear && selectedPayData && (
                    <div>
                      <b style={{ fontSize: '25px' }}>
                        {selectedPayData[selectedObcina]?.[selectedYear] ||
                          'N/A'}{' '}
                      </b>
                    </div>
                  )}
                </div>
                <div className="info-text">Indeks plače</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podrobnosti;
