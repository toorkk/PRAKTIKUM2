import "./Legend.css";

function Legend() {
      let colors = ["#FFA8BDff", "#E79ABFff", "#CE8CC1ff", "#B67EC3ff", "#9E70C5ff", "#8562C7ff", "#6D54C9ff", "#5546CBff", "#3C38CDff", "#242ACFff"]


      return(
        <div className={'info legend leaflet-bottom leaflet-right'}>
            <i style={{background: colors[0]}}></i>165+<br/>
            <i style={{background: colors[1]}}></i>165-135<br/>
            <i style={{background: colors[2]}}></i>135-115<br/>
            <i style={{background: colors[3]}}></i>115-100<br/>
            <i style={{background: colors[4]}}></i>100-90<br/>
            <i style={{background: colors[5]}}></i>90-75<br/>
            <i style={{background: colors[6]}}></i>75-60<br/>
            <i style={{background: colors[7]}}></i>60-45<br/>
            <i style={{background: colors[8]}}></i>45-30<br/>
            <i style={{background: colors[9]}}></i>30-0<br/>

      </div>
      )
}

export default Legend;