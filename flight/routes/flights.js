const axios = require('axios');
const express = require('express');
const router = express.Router();

axios.defaults.baseURL = "http://admin:password@localhost:5984/flights";

/* GET all flights */
router.get('/', function(req, res, next) {
  
  // if we don't have a query
  if (Object.keys(req.query).length === 0) {
    axios.get("/_all_docs")
      .then((response) => {
        if (response != null) {
          res.send(response.data);
        } else {
          res.send("There was an issue with your request.\n");
        }
      })
  } else {
    // validate and convert query
    var query = {}
    var skip = req.query.skip == null ? 0 : parseInt(req.query.skip);
    var limit = req.query.limit == null ? 25 : parseInt(req.query.limit);
    if (req.query.flight_num != null) query.flight_num = req.query.flight_num;
    if (req.query.origin != null) query.origin = req.query.origin;
    if (req.query.dest != null) query.dest = req.query.dest;
    if (req.query.departure != null) query.departure = req.query.departure;
    if (req.query.arrival != null) query.arrival = req.query.arrival;

    // send query off
    axios.post("/_find", data = {"selector": query, "skip": skip, "limit": limit}
      ).then((response) => {
        if (response != null) {
          res.send(response.data.docs);
        } else {
          res.send("There was an issue with your request.\n");
        }
      }).catch(e => console.log(e));
  }
});

/* GET flight by id */
router.get('/:id', function(req, res, next) {
  axios.get("/" + req.params.id)
    .then((response) => {
      if (response != null) {
        res.send(response.data);
      } else {
        res.send("There was an issue with your request.\n");
      }
    })
})


module.exports = router;
