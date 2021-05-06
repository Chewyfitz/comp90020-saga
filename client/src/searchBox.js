/* eslint-disable no-use-before-define */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function Tags(name) {
  const classes = useStyles();
    console.log(name.name)



    
  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={top100Films}
        getOptionLabel={(option) => option.title}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={name.name}
            placeholder="Syd"
            onKeyPress={(ev) => {
            console.log(`Pressed keyCode ${ev.key}`);
            if (ev.key === 'Enter') {
              // Do code here
              ev.preventDefault();
              console.log(params);
            }}}
          />
        )}
      />
    </div>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
];
