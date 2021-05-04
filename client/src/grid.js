import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ServicePanel from './table';
import DatePickers from './datePicker';
import DenseHeightGrid from "./rowPicker";

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
}));

export default function AutoGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs>
        <Paper className={classes.paper}><p>Flights</p><DatePickers /><DenseHeightGrid type="Flights" /></Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}><p>Accommodation</p><DatePickers /><DenseHeightGrid type="Accommodation" /></Paper>
          
        </Grid>
        <Grid item xs>
        <Paper className={classes.paper}><p>Transport</p><DatePickers /><DenseHeightGrid type="Transport" /></Paper>
        </Grid>
      </Grid>

    </div>
  );
}