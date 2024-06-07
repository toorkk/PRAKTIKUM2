import React, { useState } from 'react';
import "../NavigationPanel.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import jsonData from '../../data/Regije_vredi.json';
import obcineData from '../../data/statisticne_regije_obcine.json';
import logo from './../assets/logo-no-background.png'; // Import your logo

function NavigationPanel({ onSelectItem }) {
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [expandedRegions, setExpandedRegions] = useState({});
  
    const togglePanel = () => {
        setIsPanelActive(!isPanelActive);
    };

    const toggleRegion = (region) => {
        setExpandedRegions({
            ...expandedRegions,
            [region]: !expandedRegions[region]
        });
    };

    const handleObcinaClick = (obcina) => {
        onSelectItem(obcina);
    };
  
    const regions = jsonData.slice(1)
                            .map(region => region.Regije)
                            .filter(region => region !== "SLOVENIJA");

    const matchedData = regions.map(region => {
        const matchedObcine = obcineData.filter(item => item["Ime statistične regije"] === region);
        return { region, obcine: matchedObcine.map(item => item["Ime občine"]) };
    });
  
    return (
        <div id="navigation-panel">
            <div className={`toggle-icon top ${isPanelActive ? 'active' : ''}`} onClick={togglePanel}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div className={`extended-panel ${isPanelActive ? 'active' : ''}`}>
                <div className="header">
                    <img src={logo} alt="Logo" className="header-logo" /> 
                </div>
                <div className="scrollable-content">
                    <ul style={{paddingLeft: "0.5rem"}} className="list-container">
                        {matchedData.map((data, index) => (
                            <li key={index} className="list-item">
                                <div className="list-item-content" onClick={() => toggleRegion(data.region)}>
                                    <span>{data.region}</span>
                                    <FontAwesomeIcon
                                        icon={expandedRegions[data.region] ? faChevronUp : faChevronDown}
                                        className="arrow-icon"
                                    />
                                </div>
                                {expandedRegions[data.region] && (
                                    <ul className="sub-list">
                                        {data.obcine.map((obcina, idx) => (
                                            <li key={idx} onClick={() => handleObcinaClick(obcina)}>{obcina}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default NavigationPanel;
