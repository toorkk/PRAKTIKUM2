import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
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
  const [selectedObcina, setSelectedObcina] = useState(data[1].Občine); 

  const handleObcinaChange = (event) => {
    setSelectedObcina(event.target.value);
  };

  const selectedData = data.find(item => item.Občine === selectedObcina);

  const years = Object.keys(selectedData).filter(key => key !== "Občine" && parseInt(key) >= 2009);

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
          {data.filter(item => item["Občine"] !== "Ime").map((item, index) => (
            <option key={index} value={item.Občine}>{item.Občine}</option>
          ))}
        </select>
      </div>
      <div className="obcina-box">
        <div className="left-box">
          <h2>{selectedObcina}</h2>
          <ul>
            {years.map((year, index) => (
              <li key={index}>{year}: {selectedData[year]}</li>
            ))}
          </ul>
        </div>
        <div className="right-box">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Podrobnosti;
