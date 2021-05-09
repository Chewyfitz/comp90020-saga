import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

// import Button from '@material-ui/core/Button';

export default function DenseHeightGrid({type,sendDataToParent,filter}) {
  // const { data } = useDemoData({
  //   dataSet: 'Commodity',
  //   rowLength: 100,
  //   maxColumns: 6,
  // });
  
  const [fetchResponse, setFetchResponse] = React.useState();

  React.useEffect(() => {
    
    fetch("http://localhost:5001/flights?origin="+filter)
    .then(response => response.json())
    .then(data => setFetchResponse(data));
  },[filter])
  var data = {
    columns:[{field: "id", hide: true},
             {field: "type", headerName: type, width: 130},
             {field: "date", headerName: "Date", width: 100},
             {field: "price", headerName: "Price", width: 100},],
    rows:[]
  }
  
  var all_data = {}
  if(fetchResponse){
    
    data.rows=[];
    
    for(var i=0;i<fetchResponse.length;i++){
      
      var tmp = {id:fetchResponse[i]["_id"] ,type:fetchResponse[i]["flight_num"] ,date:fetchResponse[i]["departure"],price:fetchResponse[i]["price"]};
      all_data[fetchResponse[i]["_id"]] = tmp;
      data.rows.push(tmp);
    }
    
  }
  
  return (
    <div style={{ height: 400, width: '100%' }}>
      
      <DataGrid   onSelectionModelChange={(newSelection) => {
        
        if(fetchResponse){
          // console.log(all_data[newSelection["selectionModel"][0]]);
          sendDataToParent(all_data[newSelection["selectionModel"][0]],type);
        }
    // setFetchResponse(sonsolenewSelection.rows);
  }}
   rowHeight={25} {...data} />  
      
    </div>
  );
}
