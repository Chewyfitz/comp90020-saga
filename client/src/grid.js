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


import BasicTextField from "./textField"

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
    height: 350,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  
}));

export default function AutoGrid() {
  const classes = useStyles();
  var flightsDeparting_obj ={
    "type": "No Departing Flights Selected",
    "date": "",
    "price": 0,
  }
  var flightsReturning_obj ={
    "type": "No Returning Flights Selected",
    "date": "",
    "price": 0,
  }
  var accom_obj ={
    "type": "No Accomodation Selected",
    "date": "",
    "price": 0,
  }

  var [isOpen1, setIsOpen1] = React.useState(flightsDeparting_obj);
  var [isOpen2, setIsOpen2] = React.useState(flightsReturning_obj);
  var [isOpen3, setIsOpen3] = React.useState(accom_obj);
  
  const sendDataToParent = (index,type) => { // the callback. Use a better name
    
    
    switch(type){
      case "Flights Departing":
        flightsDeparting_obj = {
          "type": index["type"],
          "date": index["date"],
          "price": index["price"],
        }
        setIsOpen1(flightsDeparting_obj)
        break
      case "Flights Returning":
        flightsReturning_obj = {
          "type": index["type"],
          "date": index["date"],
          "price": index["price"],
        }
        setIsOpen2(flightsReturning_obj)
        break
      case "Accommodation":
        accom_obj = {
          "type": index["type"],
          "date": index["date"],
          "price": index["price"],
        }
        setIsOpen3(accom_obj)
        break
    }
    
  };


  var [fromFilter, setFromFilter] = React.useState();
  var [toFilter, setToFilter] = React.useState();
  var [dateFromFilter, setDateFromFilter] = React.useState();
  var [dateToFilter, setdateToFilter] = React.useState();

  const updateFrom = (input) => {
    setFromFilter(input);
    
  }
  const updateTo = (input) => {
    setToFilter(input);
    
    
  }


  const setFilters = (from,to,leaveDate,returnDate) => {
    console.log("----------");
    console.log(from);
    console.log(to);
    console.log(leaveDate);
    console.log(returnDate);

    setFromFilter(from);
    setToFilter(to);
    setDateFromFilter(leaveDate);
    setdateToFilter(returnDate);

  }

  
  // var [fromFilter, setFromFilter] = React.useState();
  // var [fromFilter, setFromFilter] = React.useState();
  
  return (
    <div className={classes.root}>

      <div className="container" style={{display:"flex"}}>
      
        
        
        <Box m={4} pt={1} l={5}>
        <BasicTextField setFiltersFunction={setFilters}/>
        </Box>
      </div>
      <Grid container spacing={3}>
        <Grid item xs>
        <Paper className={classes.paper}><p>Flights Departing</p><DenseHeightGrid type="Flights Departing" sendDataToParent={sendDataToParent} from={fromFilter} to={toFilter} date={dateFromFilter}/></Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}><p>Flights Returning</p><DenseHeightGrid type="Flights Returning" sendDataToParent={sendDataToParent} from={toFilter} to={fromFilter} date={dateToFilter}/></Paper>
          
        </Grid>
        <Grid item xs>
        <Paper className={classes.paper}><p>Accommodation</p> <DenseHeightGrid type="Accommodation" sendDataToParent={sendDataToParent} to={toFilter}/></Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <Paper className={classes.width}>Summary<SpanningTable flightsData={isOpen1} accomData={isOpen2} transData={isOpen3} /></Paper>
      </Grid>


    </div>
  );
}