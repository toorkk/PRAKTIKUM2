import { createElement } from "react";
import "./Legend.css";

function Legend() {

      return(
        <div className={'info legend leaflet-bottom leaflet-right legend'}>
            <i style={{background: '#10451d'}}></i>165+<br/>
            <i style={{background: '#155d27'}}></i>165-135<br/>
            <i style={{background: '#1a7431'}}></i>135-115<br/>
            <i style={{background: '#208b3a'}}></i>115-100<br/>
            <i style={{background: '#25a244'}}></i>100-90<br/>
            <i style={{background: '#2dc653'}}></i>90-75<br/>
            <i style={{background: '#4ad66d'}}></i>75-60<br/>
            <i style={{background: '#6ede8a'}}></i>60-45<br/>
            <i style={{background: '#92e6a7'}}></i>45-30<br/>
            <i style={{background: '#b7efc5'}}></i>30-0<br/>

      </div>
      )
}

export default Legend;