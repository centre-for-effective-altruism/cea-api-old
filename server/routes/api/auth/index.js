var express = require('express');
var router = express.Router();


router.use('/login', function(res,req){
	res.send('Logging in')
});

router.use('/logout', function(res,req){
	res.send('Logging out')
});



module.exports = router;