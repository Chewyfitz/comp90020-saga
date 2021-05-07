const axios = require('axios');
const express = require('express');
const router = express.Router();

axios.defaults.baseURL =
  "http://admin:password@"
    + (process.env.DATABASE || "localhost")
    + ":5984";

/* GET all flights */
router.get('/', (req, res) => {
  // if we don't have a query
  if (Object.keys(req.query).length === 0) {
    axios.get("/flights/_all_docs")
      .then((response) => {
        res.send(response.data);
      }).catch(e => console.log(e));
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
    if (req.query.price != null) query.price = req.query.price;

    // send query off
    axios.post("/flights/_find", data = {"selector": query, "skip": skip, "limit": limit}
      ).then((response) => {
        res.send(response.data.docs);
      }).catch(e => console.log(e));
  }
});

/* GET flight by id */
router.get('/:id', (req, res) => {
  axios.get("/flights/" + req.params.id)
    .then((response) => {
      res.send(response.data);
    }).catch(e => {
      if (e.response.status === 404) {
        res.status(404).send(e.response.data);
      } else {
        console.log(e.response);

      }
    });
})


module.exports = router;
