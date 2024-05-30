import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faMale, faFemale } from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import data from '../../data/Podatki.json';
import '../Podrobnosti.css';

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
  const initialObcina = data.length > 1 ? data[1].Občine : '';
  const [selectedObcina, setSelectedObcina] = useState(initialObcina);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    setSelectedData(data.find(item => item.Občine === selectedObcina));
  }, [selectedObcina]);

  const handleObcinaChange = (event) => {
    setSelectedObcina(event.target.value);
    setSelectedYear(null); // Reset selected year when changing the municipality
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const years = selectedData ? Object.keys(selectedData).filter(key => key !== "Občine" && parseInt(key) >= 2009) : [];

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Indeks delovne migracije',
        data: years.map(year => selectedData[year]),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="podrobnosti-container">
      <div className="obcina-selector">
        <label htmlFor="obcina">Izberi občino: </label>
        <select id="obcina" value={selectedObcina} onChange={handleObcinaChange}>
          {data.filter(item => item["Občine"] !== "Ime"  && item["Občine"] !== "SLOVENIJA").map((item) => (
            <option key={item.Občine} value={item.Občine}>{item.Občine}</option>
          ))}
        </select>
      </div>
      {selectedData && (
        <div className="obcina-box">
          <div className="left-box">
            <h2>{selectedObcina}</h2>
            <select value={selectedYear} onChange={handleYearChange} style={{ marginBottom: '10px' }}>
                  <option value="">Izberi Leto</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
            <div className="info-boxes">
              <div className="info-box">
                <div className="info-icon green-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                {selectedYear && (
                  <div><b>{selectedData[selectedYear]}</b></div>
                )}
                <div className="info-text">Indeks delovne migracije</div>
                
              </div>
              <div className="info-box">
                <div className="info-icon blue-icon">
                  <FontAwesomeIcon icon={faMale} />
                </div>
                <div className="info-text">Indeks delovne migracije(moški)</div>
              </div>
              <div className="info-box">
                <div className="info-icon pink-icon">
                  <FontAwesomeIcon icon={faFemale} />
                </div>
                <div className="info-text">Indeks delovne migracije(ženske)</div>
              </div>
            </div>
          </div>
          <div className="right-box">
            <Line data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Podrobnosti;
