import React, { Fragment } from 'react';
import { useMap } from 'react-leaflet';
import { useV2Sidebar, V2SidebarPanelsType } from 'react-leaflet-v2-sidebar';
import { renderToString } from 'react-dom/server'; // Import renderToString
import "leaflet-sidebar-v2/css/leaflet-sidebar.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Regije from '../../data/Regije_vredi.json'; // Importing the JSON data

function SidebarComponent() {
  const map = useMap();

  const regions = Regije.filter(obj => obj.Regije && obj.Regije !== 'SLOVENIJA').map(obj => obj.Regije);

  const migracijePane = renderToString(
    <div style={{ borderLeft: '2px solid lightblue', paddingLeft: '10px' }}>
      <h5 style={{ borderBottom: "2px solid lightblue", marginTop: "15px", color: "#25a2d1", padding: "0 0 5px 0" }}><b>Regije/Občine</b></h5>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {regions.map((region, index) => (
          <li key={index} style={{ cursor: 'pointer', borderBottom: '1px solid #ddd', display: 'block', fontSize: '14px', textDecoration: 'none', listStylePosition: 'inside', color: '#000', paddingTop: '13px', paddingBottom: '13px', paddingLeft: '30px', WebkitPaddingEnd: '10px !important', WebkitPaddingStart: '30px !important', background: 'url(../css/images/off.png) left center no-repeat' }}>
            {region}
          </li>
        ))}
      </ul>
    </div>
  );

  const panels: V2SidebarPanelsType = [
    {
      id: 'userInfo',
      tab: '<i class="fas fa-bars"></i>', 
      pane: migracijePane,
      title: 'MIGRACIJE',
      position: 'top',
    },
    {
      id: 'settings',
      tab: '<i class="fas fa-cog"></i>', 
      pane: 'Settings Tab Content',
      title: 'Settings Tab',
      position: 'bottom',
    }
  ];
  useV2Sidebar(map, panels);

  return <Fragment></Fragment>;
}

export default SidebarComponent;
