const axios = require('axios');
const Mutex = require('async-mutex').Mutex;
const lock = new Mutex();
const express = require('express');
const router = express.Router();

axios.defaults.baseURL =
  "http://admin:password@"
    + (process.env.DATABASE || "localhost")
    + ":5984";

/* GET bookings */
router.get('/', (req, res) => {
  // if we don't have a query
  if (Object.keys(req.query).length === 0) {
    axios.get("/hotel_bookings/_all_docs")
      .then((response) => {
        res.send(response.data);
      }).catch(e => console.log(e));
  } else {
    // validate and convert query
    var query = {}
    var skip = req.query.skip == null ? 0 : parseInt(req.query.skip);
    var limit = req.query.limit == null ? 25 : parseInt(req.query.limit);
    if (req.query.hotel != null) query.hotel = req.query.hotel;
    if (req.query.user != null) query.user = req.query.user;
    if (req.query.status != null) query.status = req.query.status;
    // use "start" and "finish" to check for overlap!
    if (req.query.start != null && req.query.finish != null) {
      // check overlap - https://stackoverflow.com/a/13513973
      query.start = {"$lt": req.query.finish};
      query.finish = {"$gt": req.query.start};
    }

    // send query off
    axios.post("/hotel_bookings/_find", data = {"selector": query, "skip": skip, "limit": limit}
      ).then((response) => {
        res.send(response.data.docs);
      }).catch(e => console.log(e));
  }
});

/* Get an id */
router.get('/id', (req, res) => {
  axios.get('/_uuids')
    .then((response) => {
      res.send({
        ok:true,
        id:response.data.uuids[0]
      });
    }).catch(e => console.log(e));
})

/* Create a booking. */
router.put('/:id', (req, res) => {
  lock.runExclusive(() => {
    // validate fields
    if (req.body.user == null || req.body.hotel == null 
        || req.body.start == null || req.body.finish == null) {
      return res.status(400).send({
        message:"bookings require user, hotel, start and finish fields"
      });
    }

    var id = req.params.id;
    var hotel = req.body.hotel;
    var start = req.body.start;   // customer moves in on this day
    var finish = req.body.finish; // customer moves out on this day (someone can then move in on the same day)
    var user = req.body.user;

    // check the hotel is valid
    axios
      .get("/hotels/" + hotel)
      .then(() => {
        // check whether hotel is booked in an active booking with a diff id
        var selector =  {
          hotel: hotel, 
          status: "active", 
          "$not": {_id : id },
          // check overlap - https://stackoverflow.com/a/13513973
          start: {"$lt": finish},
          finish: {"$gt": start}
        };
        axios
          .post("/hotel_bookings/_find", data={selector: selector})
          .then(response => {
            //  - if booked return fail status
            if (response.data.docs.length > 0) {
              res.send({ok:false, message:"that hotel is already booked"})
            //  - otherwise create booking
            } else {
              axios
                .put("hotel_bookings/" + id, data={
                  hotel: hotel,
                  start: start,
                  finish: finish,
                  user: user,
                  status: "active"
                })
                .then(response => {
                  res.send(response.data);
                })
                .catch(e => {
                  if (e.response.status === 409) {
                    res.send({ok:true, id:id, message:"your booking already exists"});
                  } else {
                    console.log(e);
                  }
                })
            }
          })
          .catch(e => console.log(e));

      })
      .catch(e => {
        if (e.response.status === 404) {
          res.status(404).send({message:"hotel not found - please use a valid hotel id"});
        } else {
          console.log(e);
        }
      })
  })

});

/* Cancel a booking. */
router.delete('/:id', (req, res) => {
  lock.runExclusive(() => {  
    var id = req.params.id;
    // fetch the booking to make sure it exists
    axios
      .get('/hotel_bookings/' + id)
      .then(response => {
        response.data.status = "cancelled";
        axios
          .put("hotel_bookings/" + id, data=response.data)
          .then(response => {
            res.send(response.data);
          })
          .catch(e => console.log(e))
      })
      .catch(e => {
        if (e.response.status === 404) {
          res.status(404).send({message:"booking not found - please use a valid booking id"});
        } else {
          console.log(e);
        }
      })

    // return success status
  })

});


module.exports = router;
