import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

// import Button from '@material-ui/core/Button';

export default function DenseHeightGrid({type,sendDataToParent}) {
  // const { data } = useDemoData({
  //   dataSet: 'Commodity',
  //   rowLength: 100,
  //   maxColumns: 6,
  // });
  
  const [fetchResponse, setFetchResponse] = React.useState();

  React.useEffect(() => {
    fetch("http://localhost:3000/flights?origin=Australia")
    .then(response => response.json())
    .then(data => setFetchResponse(data));
  },[])
  var data = {
    columns:[{field: "id", hide: true},
             {field: "type", headerName: type, width: 100},
             {field: "date", headerName: "Date", width: 100},
             {field: "price", headerName: "Price", width: 100},],
    rows:[{id: "ceeff9f1-6713-53ab-ad98-91e31b8a4eaa",type: "D-7002",date:"1/2/2012",price:"$100"}]
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
        console.log(newSelection)
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
