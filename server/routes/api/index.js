var express = require('express');
var router = express.Router();


router.use('/organisations', require('./organisations'));
router.use('/donors', require('./donors'));
router.use('/donations', require('./donations'));
router.use('/targets', require('./targets'));
router.use('/progress', require('./progress'));

router.get('/', function(req, res, next) {
  res.send("Error: No endpoint")
});




module.exports = router;