var express = require('express');
var router = express.Router();


router.post('/login', function(req,res,next){
	res.json({message:'Logging in',email:req.body.email})
});

router.get('/logout', function(req,res,next){
	res.json('Logging out')
});



module.exports = router;