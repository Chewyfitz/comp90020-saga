const axios = require('axios');
const Mutex = require('async-mutex').Mutex;
const lock = new Mutex();
const express = require('express');
const router = express.Router();

axios.defaults.baseURL = "http://admin:password@localhost:5984";

/* GET bookings */
router.get('/', (req, res) => {
  res.send("<p>bookings here</p>");
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
    if (req.body.user == null || req.body.flight == null) {
      return res.status(400)
                .send({message:"bookings require user and flight fields"});
    }

    // fields include: booked by, booked flight[, booking status = (active/cancelled)]
    var id = req.params.id;
    var flight = req.body.flight;
    var user = req.body.user;

    // check the flight is valid
    axios
      .get("/flights/" + flight)
      .then(() => {
        console.log("flight valid");
        // check whether item is booked in an active booking with a diff id
        axios
          .post("/flight_bookings/_find", data={selector: {flight: id, status: "active"}, })
          .then(response => {
            console.log("found flight data");
            //  - if booked return fail status
            if (response.data.docs.length > 0) {
              console.log("flight already booked");
              res.send({ok:false, message:"that flight is already booked"})
            //  - otherwise create booking
            } else {
              console.log("creating booking");
              axios
                .put("flight_bookings/" + id, data={
                  flight: flight,
                  user: user,
                  status: "active"
                })
                .then(response => {
                  console.log("booking sent");
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
          res.status(404).send({message:"flight not found - please use a valid flight id"});
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
      .get('/flight_bookings/' + id)
      .then(response => {
        response.data.status = "cancelled";
        axios
          .put("flight_bookings/" + id, data=response.data)
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
