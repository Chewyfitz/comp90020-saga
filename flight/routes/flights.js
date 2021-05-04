var express = require('express');
var router = express.Router();

/* GET /flights/ */
router.get('/', function(req, res, next) {
  res.send("<p>flights here</p>");
});

module.exports = router;
