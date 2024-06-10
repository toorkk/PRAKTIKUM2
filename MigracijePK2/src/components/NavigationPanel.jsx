import React, { useState } from 'react';
import "../NavigationPanel.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faChevronUp, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import jsonData from '../../data/Regije_vredi.json';
import obcineData from '../../data/statisticne_regije_obcine.json';
import logo from './../assets/logo-no-background.png'; 

function NavigationPanel({ onSelectItem }) {
    const [activePanel, setActivePanel] = useState(null); 
    const [expandedRegions, setExpandedRegions] = useState({});
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const togglePanel = (panel) => {
        setActivePanel(activePanel === panel ? null : panel); 
    };

    const toggleRegion = (region) => {
        setExpandedRegions({
            ...expandedRegions,
            [region]: !expandedRegions[region]
        });
    };

    const toggleQuestion = (question) => {
        setExpandedQuestions({
            ...expandedQuestions,
            [question]: !expandedQuestions[question]
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
        return { region, obcine: matchedObcine.map(item => ({
            "ime": item["Ime občine"],
            "id": item["Šifra občine"]
        })) };
    });

    const questionsData = [
        { question: 'Kaj je Migracije.eu?', answer: 'Migracije.eu je platforma/aplikacija, ki omogoča pregled podatkov o delovnih migracijah slovenije s pomočjo interaktivnega grafičnega vmesnika, zemljevida Slovenije!' },
        { question: 'Komu je aplikacija namenjena?', answer: 'Aplikacija je namenjena splošnim uporabnikom ali strokovnjakom, ki so zainteresirani v ogled statističnih informacij delovnih migracij Slovenije na nekoliko prijaznejši/bolj interaktiven način.' },
        { question: 'Kako uporabljati aplikacijo?', answer: 'Aplikacijo lahko uporabljate tako, da navigirate po zemljevidu Slovenije in s klikom na občino pridobite informacije o delovnih migracijah.. pravtako pa tudi grafične predstavitve korelacij med indeksom delovne migracije in povprečnih plač ter starosti slovenskih državljanov.' },
        { question: 'Kako si ogledam podrobnosti?', answer: 'Na stran s podrobnostmi lahko navigirate s klikom na gumb podrobnosti, ki se nahaja v oblaku vsake občine na zemljevidu.' },
        { question: 'Kaj prikazujejo barve?', answer: 'Barve na zemljevidu Slovenije prikazujejo indeks delovnih migracij za vsako občino/regijo posebej, temnejša zelena barva indicira, da je indeks migracij v tej občini visok kar pomeni, da visok delež prebivalcev dela znotraj svoje občine/regije. Svetlješe kot so barve, več ljudi dela izven svoje občine/regije.' },
        { question: 'Kateri podatki so uporabljeni?', answer: <>Vsi podatki prikazani/uporabljeni v naši aplikaciji so pridobljeni s spletnega mesta: <a href="https://podatki.gov.si/" target="_blank" rel="noopener noreferrer">https://podatki.gov.si/</a></> },
        { question: 'Opis spremenljivk!', answer: <><b>Indeks delovne migracije:</b> (IDM) je razmerje med številom delovno aktivnih prebivalcev (brez kmetov) v določeni teritorialni enoti delovnega mesta in številom delovno aktivnih prebivalcev (brez kmetov) v teritorialni enoti prebivališča pomnoženo s 100.<br></br><b>Koeficient starostne odvisnosti:</b> je razmerje med številom starejših (65 let ali več) in številom delovno sposobnih prebivalcev, torej prebivalcev, starih 15 do 64 let, pomnoženo s 100.</> }
    ];

    return (
        <div id="navigation-panel">
            <div className={`toggle-icon top ${activePanel === 'main' ? 'active' : ''}`} onClick={() => togglePanel('main')}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div className={`toggle-icon ${activePanel === 'info' ? 'active' : ''}`} onClick={() => togglePanel('info')} style={{ top: '60px' }}>
                <FontAwesomeIcon icon={faQuestionCircle} />
            </div>
            <div className={`extended-panel ${activePanel === 'main' ? 'active' : ''}`}>
                <div className="header">
                    <img src={logo} alt="Logo" className="header-logo" />
                </div>
                <div className="scrollable-content">
                    <ul style={{ paddingLeft: "0.5rem" }} className="list-container">
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
                                            <li className='obcine-list' key={idx} onClick={() => handleObcinaClick(obcina["id"])}>{obcina["ime"]}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={`extended-info-panel ${activePanel === 'info' ? 'active' : ''}`}>
                <div className="header">
                    <img src={logo} alt="Logo" className="header-logo" />
                </div>
                <div className="scrollable-content">
                    <ul style={{ paddingLeft: "0.5rem" }} className="list-container">
                        {questionsData.map((item, index) => (
                            <li key={index} className="list-item">
                                <div className="list-item-content" onClick={() => toggleQuestion(item.question)}>
                                    <span>{item.question}</span>
                                    <FontAwesomeIcon
                                        icon={expandedQuestions[item.question] ? faChevronUp : faChevronDown}
                                        className="arrow-icon"
                                    />
                                </div>
                                {expandedQuestions[item.question] && (
                                    <div className="answer-content">
                                        <p>{item.answer}</p>
                                    </div>
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
