import React from 'react';
import ReactDOM from "react-dom";
import { Card } from 'primereact/card';

  var body = window.props;
  var labelTitle = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
  // @ts-ignore
  document.getElementById("location").innerHTML = 'Location: '+ (body.location ? body.location : body.coordinates)



class Details extends React.Component {
  render() {
    return (
      <div className="card" id="infoCard">
          <Card title="Symbol">
            <img src={`../../static/mm_api_symbols/wsymbol_${body.symbol[0]}.png`} width="100px" className="shadow-4"></img>
          </Card><br/>

          <Card title="Temperature (°C)">
              {/* <p>{body.temp}</p> */}
              <canvas id="temperature"></canvas>
          </Card><br/>

          <Card title="Precipitation (mm)">
              {/* <p>{body.precipitation}</p> */}
              <canvas id="precipitation"></canvas>
          </Card><br/>

          <Card title="Wind Speed (m/s)">
            {/* <p>{body.wind_speed}</p> */}
            <canvas id="wind_speed"></canvas>
          </Card><br/>

          <Card title="Wind Direction (from N)">
            {/* <p>{body.wind_direction}</p> */}
            <canvas id="wind_direction"></canvas>
          </Card><br/>


      </div>
  )
  }
}


ReactDOM.render(
  <Details/>, 
  document.getElementById('table-container'), 
);


const ctx = document.getElementById('temperature');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: labelTitle,
    datasets: [{
      data: body.temp,
      tension: 0.1,
      label: "Temperature (°C)",
      borderColor: 'rgb(75, 192, 192)',
    }]
  },
  options: {
    scales: {
        y: {
            title: {
               display: true,
               text: "Temperature (°C)"
            },
            grid: {
              display: false
            }
        },
        x: {
          title: {
             display: true,
             text: "Hour"
          },
          grid: {
            display: false
          }
      }
    }
  }
});

const ctx2 = document.getElementById('precipitation');

new Chart(ctx2, {
  type: 'line',
  data: {
    labels: labelTitle,
    datasets: [{
      data: body.precipitation,
      tension: 0.1,
      label: "Precipitation (mm)",
      borderColor: 'rgb(255, 192, 192)',
    }]
  },
  options: {
    scales: {
        y: {
            title: {
               display: true,
               text: "Precipitation (mm)"
            },
            grid: {
              display: false
            }
        },
        x: {
          title: {
             display: true,
             text: "Hour"
          },
          grid: {
            display: false
          }
      }
    }
  }
});


const ctx3 = document.getElementById('wind_speed');

new Chart(ctx3, {
  type: 'line',
  data: {
    labels: labelTitle,
    datasets: [{
      data: body.wind_speed,
      tension: 0.1,
      label: "Wind Speed (m/s)",
      borderColor: 'rgb(75, 1, 192)',
    }]
  },
  options: {
    scales: {
        y: {
            title: {
               display: true,
               text: "Wind Speed (m/s)"
            },
            grid: {
              display: false
            }
        },
        x: {
          title: {
             display: true,
             text: "Hour"
          },
          grid: {
            display: false
          }
      }
    }
  }
});


const ctx4 = document.getElementById('wind_direction');

new Chart(ctx4, {
  type: 'line',
  data: {
    labels: labelTitle,
    datasets: [{
      data: body.wind_direction,
      tension: 0.1,
      label: "Wind Direction (from N)",
      borderColor: 'rgb(75, 192, 1)',
    }]
  },
  options: {
    scales: {
        y: {
            title: {
               display: true,
               text: "Wind Direction (from N)"
            },
            grid: {
              display: false
            }
        },
        x: {
          title: {
             display: true,
             text: "Hour"
          },
          grid: {
            display: false
          }
      }
    }
  }
});
