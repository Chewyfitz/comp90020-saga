import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';

import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import HotelIcon from '@material-ui/icons/Hotel';

import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
}));

export default function TransitionsModal(props) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  var allData = props.allData;
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const [accountID, setAccountID] = React.useState();
  const [departingDate, setDepartingDate] = React.useState("None");
  const [departingDesc, setDepartingDesc] = React.useState("None Selected");
  const [departingPrice, setDepartingPrice] = React.useState("None");
  const [returningDate, setReturningDate] = React.useState("None");
  const [returningDesc, setReturningDesc] = React.useState("None Selected");
  const [returningPrice, setReturningPrice] = React.useState("None");

  const [accomDesc, setAccomDesc] = React.useState(0);
  const [accomStartDate, setAccomStartDate] = React.useState("None");
  const [accomReturnDate, setAccomReturnDate] = React.useState("None");
  const [accomPrice, setAccomPrice] = React.useState(0);

  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    
    
    setDepartingDate(allData[0]["date"]);
    setDepartingDesc(allData[0]["desc"]);
    
    setReturningDate(allData[1]["date"]);
    setReturningDesc(allData[1]["desc"]);
  
    setAccomDesc(allData[2]["desc"]);
    setAccomStartDate(allData[2]["date"]);
    setAccomReturnDate(allData[2]["returnDate"]);
  
    if(allData[0]["price"] === 0){
      setDepartingPrice("");
    }
    else{
      setDepartingPrice(allData[0]["price"]);
    }

    if(allData[1]["price"] === 0){
      setReturningPrice("");
    }
    else{
      setReturningPrice(allData[1]["price"]);
    }
    if(allData[2]["price"] === 0){
      setAccomPrice("");
    }
    else{
      setAccomPrice(allData[2]["price"]);
    }
  
    setTotal(allData[0]["price"] + allData[1]["price"] + allData[2]["price"])
    console.log("YIPE");
    console.log(allData);

  },[allData])

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Checkout
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        
      >
        <Fade in={open}>
          <div className={classes.paper} >
            <h2 id="transition-modal-title">Summary</h2>
            <p id="transition-modal-description">
                Enter an Account Id to make booking from: 
                <TextField id="outlined-basic" label="Account ID" variant="outlined" value={accountID} onChange={(e) => setAccountID(e.target.value)}/>
                <Box m={3}> </Box>
                <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Flight</TableCell>
                      <TableCell align="right">Flight Date</TableCell>
                      <TableCell align="right">Details</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    
                      <TableRow key={"depart"}>
                        <TableCell component="th" scope="row">
                        <FlightTakeoffIcon /><ListItemText primary="Departing Flight"  />
                        </TableCell>
                        <TableCell align="right">{departingDate}</TableCell>
                        <TableCell align="right">{departingDesc}</TableCell>
                        <TableCell align="right">{departingPrice}</TableCell>
                        
                      </TableRow>
                      <TableRow key={"return"}>
                        <TableCell component="th" scope="row">
                        <FlightLandIcon /><ListItemText primary="Returning Flight"  />
                        </TableCell>
                        <TableCell align="right">{returningDate}</TableCell>
                        <TableCell align="right">{returningDesc}</TableCell>
                        <TableCell align="right">{returningPrice}</TableCell>
                      
                      </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>

              <Box m={3}> </Box>

              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Accomodation</TableCell>
                      <TableCell align="right">Date From</TableCell>
                      <TableCell align="right">Date To</TableCell>
                      <TableCell align="right">Details</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow key={"accom"}>
                        <TableCell component="th" scope="row">
                        <HotelIcon /><ListItemText primary="Accomodation"  />
                        </TableCell>
                        <TableCell align="right">{accomStartDate}</TableCell>
                        <TableCell align="right">{accomReturnDate}</TableCell>
                        <TableCell align="right">{accomDesc}</TableCell>
                        <TableCell align="right">{accomPrice}</TableCell>
                      </TableRow>
                    
                  </TableBody>
                </Table>
              </TableContainer>
              <Box m={3}> </Box>
              total = {total}
              <Button variant="contained" color="primary" disabled={ accountID == null || accountID == ""}>
                Book
              </Button>
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}


