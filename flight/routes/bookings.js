var express = require('express');
var router = express.Router();

/* GET /bookings/ */
router.get('/', function(req, res, next) {
  res.send("<p>bookings here</p>");
});

module.exports = router;
