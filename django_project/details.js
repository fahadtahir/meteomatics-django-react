import React from 'react';
import ReactDOM from "react-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';

  var body = window.props;
  // @ts-ignore
  document.getElementById("location").innerHTML = 'Location: '+ (body.location ? body.location : body.coordinates)



class Details extends React.Component {
  render() {
    return (
      <div className="card">
          <Card title="Symbol">
            <img src={`../../static/mm_api_symbols/wsymbol_${body.symbol}.png`} width="100px" className="shadow-4"></img>
          </Card><br/>

          <Card title="Temperature (°C)">
              <p>{body.temp}</p>
          </Card><br/>

          <Card title="Precipitation (mm)">
              <p>{body.precipitation}</p>
          </Card><br/>

          <Card title="Wind Speed (m/s)">
            <p>{body.wind_speed}</p>
          </Card><br/>

          <Card title="Wind Direction (from N)">
            <p>{body.wind_direction}</p>
          </Card><br/>


      </div>
  )
  }
}


ReactDOM.render(
  <Details/>, 
  document.getElementById('table-container'), 
);