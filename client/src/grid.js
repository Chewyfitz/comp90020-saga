import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ServicePanel from './table';
import DatePickers from './datePicker';
import DenseHeightGrid from "./rowPicker";
import SpanningTable from "./summary";
import Tags from "./searchBox";
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 500,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  width: {
    height: 200,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  
}));

export default function AutoGrid() {
  const classes = useStyles();
  var flights_obj ={
    "type": "No Flights Selected",
    "date": "",
    "price": 0,
  }
  var accom_obj ={
    "type": "No Accommodation Selected",
    "date": "",
    "price": 0,
  }
  var trans_obj ={
    "type": "No Transport Selected",
    "date": "",
    "price": 0,
  }

  var [isOpen1, setIsOpen1] = React.useState(flights_obj);
  var [isOpen2, setIsOpen2] = React.useState(accom_obj);
  var [isOpen3, setIsOpen3] = React.useState(trans_obj);
  
  

  const sendDataToParent = (index,type) => { // the callback. Use a better name
    console.log("WE DID IT");
    console.log(index);
    switch(type){
      case "Flights":
        flights_obj = {
          "type": index["type"],
          "date": index["date"],
          "price": index["price"],
        }
        setIsOpen1(flights_obj)
        break
      case "Accommodation":
        accom_obj = {
          "type": index["type"],
          "date": index["date"],
          "price": index["price"],
        }
        setIsOpen2(accom_obj)
        break
      case "Transport":
        trans_obj = {
          "type": index["type"],
          "date": index["date"],
          "price": index["price"],
        }
        setIsOpen3(trans_obj)
        break
    }
    
  };

  
  return (
    <div className={classes.root}>
      <div className="container" style={{display:"flex"}}>
      <Box m={1} pt={1} pl={5}>
        <Tags name="Leaving From"/> 
        </Box>
        <Box m={1} pt={1} l={5}>
        <Tags name="Going To"/> 
        </Box>
      </div>
      <div className="container" style={{display:"flex"}}>
      <Box m={1} pt={1} pl={5}>
        <Tags name="Departing"/>  
        </Box>
        <Box m={1} pt={1} l={5}>
        <Tags name="Returning"/> 
        </Box>
      </div>
      <Grid container spacing={3}>
        <Grid item xs>
        <Paper className={classes.paper}><p>Flights</p><DenseHeightGrid type="Flights" sendDataToParent={sendDataToParent} /></Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}><p>Accommodation</p><DenseHeightGrid type="Accommodation" sendDataToParent={sendDataToParent}/></Paper>
          
        </Grid>
        <Grid item xs>
        <Paper className={classes.paper}><p>Transport</p> <DenseHeightGrid type="Transport" sendDataToParent={sendDataToParent}/></Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <Paper className={classes.width}>Summary<SpanningTable flightsData={isOpen1} accomData={isOpen2} transData={isOpen3} /></Paper>
      </Grid>

    </div>
  );
}