var express = require('express');
var router = express.Router();


router.use('/fundraising', require('./fundraising'));



module.exports = router;