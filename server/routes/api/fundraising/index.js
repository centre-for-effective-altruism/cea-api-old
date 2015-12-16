var express = require('express');
var router = express.Router();
var passwordless = require('passwordless')


router.use('/organisations', passwordless.restricted(), require('./organisations'));
router.use('/donors', passwordless.restricted(), require('./donors'));
router.use('/donations', passwordless.restricted(), require('./donations'));
router.use('/targets', passwordless.restricted(), require('./targets'));
router.use('/progress', require('./progress'));





module.exports = router;