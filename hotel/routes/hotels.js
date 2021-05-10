const axios = require('axios');
const express = require('express');
const router = express.Router();

axios.defaults.baseURL =
  "http://admin:password@"
    + (process.env.DATABASE || "localhost")
    + ":5984";

/* GET all hotels */
router.get('/', (req, res) => {
  // if we don't have a query
  if (Object.keys(req.query).length === 0) {
    axios.get("/hotels/_all_docs")
      .then((response) => {
        res.send(response.data);
      }).catch(e => console.log(e));
  } else {
    // validate and convert query
    var query = {}
    var skip = req.query.skip == null ? 0 : parseInt(req.query.skip);
    var limit = req.query.limit == null ? 25 : parseInt(req.query.limit);
    if (req.query.location != null) query.location = req.query.location;
    if (req.query.price != null) query.price = req.query.price;

    // send query off
    axios.post("/hotels/_find", data = {"selector": query, "skip": skip, "limit": limit}
      ).then((response) => {
        res.send(response.data.docs);
      }).catch(e => console.log(e));
  }
});

/* GET hotel by id */
router.get('/:id', (req, res) => {
  axios.get("/hotels/" + req.params.id)
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
