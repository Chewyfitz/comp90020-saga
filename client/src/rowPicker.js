import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function DenseHeightGrid({type}) {
  // const { data } = useDemoData({
  //   dataSet: 'Commodity',
  //   rowLength: 100,
  //   maxColumns: 6,
  // });
  console.log(type);
  const data = {
    columns:[{field: "id", hide: true},
             {field: "type", headerName: type, width: 160},
             {field: "date", headerName: "Date", width: 100},
             {field: "price", headerName: "Price", width: 100},],
    rows:[{id: "ceeff9f1-6713-53ab-ad98-91e31b8a4eaa",type: "D-7002",date:"1/2/2012",price:"$100"}]
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rowHeight={25} {...data} />
    </div>
  );
}
