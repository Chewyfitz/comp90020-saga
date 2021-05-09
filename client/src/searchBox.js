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

export default function Tags(props) {
    
    var setKeyword = props.onChange;
    var name = props.name;
    const classes = useStyles();
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            
            console.log(event.target.value);
            setKeyword(event.target.value);
        }
      }

  return (
    <div className={classes.root}>
          <input 
            key="random1"
            value={name}
            placeholder={"search country"}
            // onChange={(e) => setKeyword(e.target.value)}
            // onChange={(e) => console.log(e.key)}
            onKeyDown={handleKeyDown}
            />
      {/* <Autocomplete
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
      /> */}
    </div>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
];
