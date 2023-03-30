import React from 'react';
import ReactDOM from "react-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

  var body = [];
  {window.props.map(CEntry => ( 
    body.push( 
      {
        coordinate_id: CEntry.coordinate_id,
        user_id: CEntry.user_id,
        latitude: CEntry.latitude,
        longitude: CEntry.longitude,
        created_at: CEntry.created_at,
        min_temp: CEntry.min_temp,
        max_temp: CEntry.max_temp,
        symbol: CEntry.symbol,
      }
    )
  ))}
  
  const imageBodyTemplate = (rowData) => {
    return <img src={`../static/mm_api_symbols/wsymbol_${rowData.symbol}.png`} alt-image={`../static/mm_api_symbols/wsymbol_0.png`} width="64px" className="shadow-4" />;
  };

  const viewDetails = (id, e)=> {
    window.location.href = ('detail/'+id);
  }

  const deleteObject = (id, e)=> {
    if (confirm('Are you sure you want to delete this entry?')) {
      // @ts-ignore
      var token  = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      fetch(`/coordinates/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // @ts-ignore
          'X-CSRFToken': token.toString(),
        },
      })
      .then(response => {
        console.log(response);
        if (response.status==200) {
          //useState not working
          window.location.reload();
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
  }

  const latitudeEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} 
    minFractionDigits={2} maxFractionDigits={7} min={-90} max={90} useGrouping={false} />;
  };

  const longitudeEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} 
    minFractionDigits={2} maxFractionDigits={7} min={-180} max={180} useGrouping={false} />;
  };

  const deleteBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={(e) => deleteObject(rowData.coordinate_id)}/>
        </React.Fragment>
    );
  };

            
  const infoBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button label="More Info" size="sm" rounded severity="info" onClick={(e) => viewDetails(rowData.coordinate_id, e)}/>
        </React.Fragment>
    );
  };


class Table extends React.Component {
  state = { 
    globalFilterValue: '' ,
    filter: {global: { value: null, matchMode: FilterMatchMode.CONTAINS }},
    data: body,
    dialog: false
  };

  //Search
  onGlobalFilterChange = (e) => {
    this.setState(prevState => ({
      globalFilterValue:  e.target.value,
      filter: {global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS }},
      data: prevState.data,
      dialog: false
    }));
  };

  //Add
  onHide = (e) => {

    this.setState(prevState => ({
      globalFilterValue:  prevState.globalFilterValue,
      filter: prevState.filter,
      data: prevState.data,
      dialog: false
    }));
    console.log(e)
  };

  //Add
  onAdd = (e) => {

    this.setState(prevState => ({
      globalFilterValue:  prevState.globalFilterValue,
      filter: prevState.filter,
      data: prevState.data,
      dialog: true
    }));
  };

    //Add
    addObject = () => {

      //useState not working
      const latitude = (document.getElementById("lat").firstChild.value);
      const longitude = (document.getElementById("long").firstChild.value);

      // @ts-ignore
      var token  = document.getElementsByName('csrfmiddlewaretoken')[0].value;

      fetch(`/coordinates/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // @ts-ignore
          'X-CSRFToken': token.toString(),
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      })
      .then(response => {
        let helper= (oldData, newRow)=> {
          oldData.push(newRow);
          return oldData
        }

        if (response.status==200) {
          response.json().then(json => {
            this.setState(prevState => ({
              globalFilterValue:  prevState.globalFilterValue,
              filter: prevState.filter,
              data: helper(prevState.data, json.newRow),
              dialog: false
            }));
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
    };

  //Update
  onRowEditComplete = (e) => {
    let { newData, index } = e;

    let helper = (oldData, newData, i, data)=> {
      oldData[i] = newData;
      console.log(data);
        oldData[i].min_temp = data.min_temp;
        oldData[i].max_temp = data.max_temp;
        oldData[i].symbol = data.symbol;
      return oldData;
    }


    // @ts-ignore
    var token  = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    fetch(`/coordinates/update/${newData.coordinate_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // @ts-ignore
        'X-CSRFToken': token.toString(),
      },
      body: JSON.stringify({
        latitude: newData.latitude,
        longitude: newData.longitude,
      }),
    })
    .then(response => {
      console.log(response);

      if (response.status==200) {
        response.json().then(json => {
          this.setState(prevState => 
            ({
            globalFilterValue:  prevState.globalFilterValue,
            filter: prevState.filter,
            data: helper(prevState.data, newData, index, json.data),
            dialog: false
            }));
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
  };

  renderHeader = (val, func, addFunc) => {
    return (
        <div className="flex justify-content-end">
          <Button label="New" icon="pi pi-plus" severity="success" onClick={addFunc} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={val} onChange={func} placeholder="Keyword Search" />
            </span>
        </div>
    );
  };

  render() {
    const { values, filter, data, dialog } = this.state;
    return (
      <div>
        <div className="card">
          <DataTable value={data} showGridlines stripedRows tableStyle={{ minWidth: '50rem' }}
          paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
          globalFilterFields={['coordinate_id', 'user_id', 'latitude', 'longitude','created_at', 'min_temp', 'max_temp', 'symbol']}
          filters={filter}
          emptyMessage="No entries found."
          header = {this.renderHeader(values, this.onGlobalFilterChange, this.onAdd)}
          editMode="row" dataKey="coordinate_id" onRowEditComplete={this.onRowEditComplete}
          >
              <Column sortable field="coordinate_id" header="ID"></Column>
              <Column sortable field="user_id" header="User"></Column>
              <Column sortable key="latitude" field="latitude" header="Latitude" 
              editor={(options) => latitudeEditor(options)}></Column>
              <Column sortable key="longitude" field="longitude" header="Longitude"
              editor={(options) => longitudeEditor(options)}></Column>
              <Column sortable field="created_at" header="Created At"></Column>
              <Column sortable field="max_temp" header="Max (°C)"></Column>
              <Column sortable field="min_temp" header="Min (°C)"></Column>
              <Column field="symbol" header="Symbol" body={imageBodyTemplate}></Column>
              <Column body={infoBodyTemplate}></Column>
              <Column rowEditor bodyStyle={{ textAlign: 'center'}} colSpan={2} headerStyle={{ width: '10%', minWidth: '7rem' }}></Column>
              <Column field="actions" header=""  bodyStyle={{ textAlign: 'center' }}  body={deleteBodyTemplate}></Column>
          </DataTable>
        </div>

        <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Entry Details" modal className="p-fluid" onHide={this.onHide}>
        <div className="field">
            <label htmlFor="name" className="font-bold">
                Latitude
            </label>
            <InputNumber id="lat" value={21}  minFractionDigits={2} maxFractionDigits={7} min={-90} max={90} useGrouping={false} />
        </div>
        <div className="field">
            <label htmlFor="description" className="font-bold">
                Longitude
            </label>
            <InputNumber className='long' id="long" value={39}  minFractionDigits={2} maxFractionDigits={7} min={-180} max={180} useGrouping={false} />
        </div>

        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={this.onHide} />
            <Button label="Save" icon="pi pi-check" onClick={this.addObject} />
        </React.Fragment>
        </Dialog>


        </div>
    )
  }
}


ReactDOM.render(
  <Table/>, 
  document.getElementById('table-container'), 
);