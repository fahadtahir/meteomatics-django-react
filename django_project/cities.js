import React from 'react';
import ReactDOM from "react-dom";

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

  import { ReactSearchAutocomplete } from 'react-search-autocomplete'

  function App() {
    // note: the id field is mandatory
    const items = window.props;
    
    // [
    //   {
    //     id: 0,
    //     name: 'Cobol'
    //   },
    //   {
    //     id: 1,
    //     name: 'JavaScript'
    //   },
    //   {
    //     id: 2,
    //     name: 'Basic'
    //   },
    //   {
    //     id: 3,
    //     name: 'PHP'
    //   },
    //   {
    //     id: 4,
    //     name: 'Java'
    //   }
    // ]

  
    const handleOnSelect = (item) => {
      // the item selected
      window.location.href = "detail/"+item.id;
    }
  
    const formatResult = (item) => {
      return (
        <>
          <span style={{ display: 'block', textAlign: 'left' }}>name: {item.name}</span>
        </>
      )
    }
  
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              items={items}
              onSelect={handleOnSelect}
              autoFocus
              formatResult={formatResult}
              fuseOptions = {{
                shouldSort: true,
                threshold: 0,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                  "name",
                ],
              }}
              placeholder = "Search cities and regions"
            />
          </div>
        </header>
      </div>
    )
  }
  

ReactDOM.render(
  App(), 
  document.getElementById('table-container'), 
);