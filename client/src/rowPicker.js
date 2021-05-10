import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';



export default function DenseHeightGrid(props) {

  
  var type = props.type;
  var sendDataToParent = props.sendDataToParent;
  var from = "origin=" + props.from + "&";
  if(type==="Flights Departing" || type==="Flights Returning"){
    var to = "dest=" + props.to + "&";
  }
  else{
    var to = "location=" + props.to + "&";
  }
  var date = "departure=" + props.date + "&";


  const [fetchResponse, setFetchResponse] = React.useState();

  React.useEffect(() => {
    if(type==="Flights Departing" || type==="Flights Returning"){
      var params= ""
      if(props.from){
        params = params+from;
      }
      if(props.to){
        params = params+to;
      }
      if(props.date){
        params = params+date;
      }

      console.log("http://localhost:5001/flights?" +params);
      fetch("http://localhost:5001/flights?" + params)
      .then(response => response.json())
      .then(data => setFetchResponse(data));
    }
    else{
      fetch("http://localhost:5002/hotels?" + to)
      .then(response => response.json())
      .then(data => setFetchResponse(data));
    }
  },[from,to,date])

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
      if(type==="Flights Departing" || type==="Flights Returning"){
        var tmp = {id:fetchResponse[i]["_id"] ,type:fetchResponse[i]["flight_num"] ,date:fetchResponse[i]["departure"],price:fetchResponse[i]["price"]};
      }
      else{
        var tmp = {id:fetchResponse[i]["_id"] ,type:fetchResponse[i]["location"] ,date:props.date,returnDate:props.dateReturn,price:fetchResponse[i]["price"]};
      }
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
