import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function ccyFormat(num) {
  console.log(num);
  if(num == ""){
    return "";
  }
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
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

var invoiceSubtotal = subtotal(rows);
var invoiceTaxes = TAX_RATE * invoiceSubtotal;
var invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function SpanningTable(all_data) {
  const classes = useStyles();

  console.log("HERER")
  console.log(all_data)
  const [fetchResponse, setFetchResponse] = React.useState();

  React.useEffect(() => {
    var flightsData = all_data["flightsData"];
    var accomData = all_data["accomData"];
    var transData = all_data["transData"];
    rows = [
      createRow("a" + flightsData["type"], flightsData["date"], flightsData["price"]),
      createRow("b" + accomData["type"], accomData["date"], accomData["price"]),
      createRow("c" + transData["type"], transData["date"], transData["price"]),
    ];
    invoiceSubtotal = subtotal(rows);
    invoiceTaxes = TAX_RATE * invoiceSubtotal;
    invoiceTotal = invoiceTaxes + invoiceSubtotal;
    setFetchResponse(rows)
  },[all_data])
  if(fetchResponse){
    console.log("IMH HERERE")
    console.log(fetchResponse);
    rows = fetchResponse;
  }

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
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
