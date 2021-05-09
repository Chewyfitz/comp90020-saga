import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import PopUp from "./Popup"; 

// import Button from '@material-ui/core/Button';
import SearchPage from "./SearchPage";

// import Overlay from 'react-bootstrap/Overlay'
// import Popover from 'react-bootstrap/Popover'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { Header, Button, Popup, Grid } from 'semantic-ui-react'
const TAX_RATE = 0.07;


const useStyles = makeStyles({
  table: {
    minWidth: 700,
    
  },
});

function ccyFormat(num) {
  
  if(num == ""){
    return "";
  }
  return `${num.toFixed(2)}`;
}

function createRow(desc, qty, unit) {
  const price = unit;
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

var rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];

var invoiceTotal = subtotal(rows);

export default function SpanningTable(all_data) {
  const classes = useStyles();

  
  
  const [fetchResponse, setFetchResponse] = React.useState();

  React.useEffect(() => {
    console.log("WHY IS THIS TRIG2");
    console.log(all_data);
    var flightsData = all_data["flightsData"];
    var accomData = all_data["accomData"];
    var transData = all_data["transData"];
    rows = [
      createRow("a" + flightsData["type"], flightsData["date"], flightsData["price"]),
      createRow("b" + accomData["type"], accomData["date"], accomData["price"]),
      createRow("c" + transData["type"], transData["date"], transData["price"]),
    ];
    invoiceTotal = subtotal(rows);
    setFetchResponse(rows)
    
  },[all_data])
  if(fetchResponse){
    rows = fetchResponse;
  }
  // const popover = (
  //   <Popover id="popover-basic">
  //     <Popover.Title as="h3">Popover right</Popover.Title>
  //     <Popover.Content>
  //       And here's some <strong>amazing</strong> content. It's very engaging.
  //       right?
  //     </Popover.Content>
  //   </Popover>
  // );
  const [state, setState] = React.useState(false);
 
  const togglePop = () => {
    setState(!state);
    console.log(state);
  };


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={rows[0].desc}>
              <TableCell>{rows[0].desc}</TableCell>
              <TableCell align="right">{rows[0].qty}</TableCell>
              <TableCell align="right">{rows[0].unit}</TableCell>
              <TableCell align="right">{ccyFormat(rows[0].price)}</TableCell>
            </TableRow>
          <TableRow key={rows[1].desc}>
              <TableCell>{rows[1].desc}</TableCell>
              <TableCell align="right">{rows[1].qty}</TableCell>
              <TableCell align="right">{rows[1].unit}</TableCell>
              <TableCell align="right">{ccyFormat(rows[1].price)}</TableCell>
          </TableRow>
          <TableRow key={rows[2].desc}>
              <TableCell>{rows[2].desc}</TableCell>
              <TableCell align="right">{rows[2].qty}</TableCell>
              <TableCell align="right">{rows[2].unit}</TableCell>
              <TableCell align="right">{ccyFormat(rows[2].price)}</TableCell>
            </TableRow>
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2} align="right">    
          <div>
              <div className="btn" onClick={togglePop}>
                <button>Checkout</button>
              </div>
          </div>

            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      {state ? <PopUp toggle={togglePop} rows={rows} /> : null}
      
    </TableContainer>

    
    
    
  );
  
}
