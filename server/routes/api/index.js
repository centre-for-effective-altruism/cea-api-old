var express = require('express');
var router = express.Router();


router.use('/auth', require('./auth'));
router.use('/fundraising', require('./fundraising'));



module.exports = router;