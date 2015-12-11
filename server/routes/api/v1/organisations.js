var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);

var defaultSelect = "SELECT slug,name,precedence FROM organisations ORDER BY precedence ASC;";

// CREATE
router.post('/', function(req, res, next) {
	var results = [];

	var data = {
		slug: req.body.slug,
		name: req.body.name,
		precedence: req.body.precedence || 5
	}
    db.tx(function(t){
	    var insert = this.none("INSERT INTO organisations(slug, name, precedence) values($1,$2,$3);",[data.slug, data.name, data.precedence])
	    var select = this.any(defaultSelect)
	    return this.batch([insert,select])
    })
    .then(function(data){
    	return res.json(data[1])
    })
    .catch(function(error){
    	next(error)
    })

});

// READ
router.get('/', function(req, res, next) {

    db.any(defaultSelect)
    .then(function(data){
    	res.json(data)
    })
    .catch(function(error){
    	next(error)
    })


});

router.get('/:slug', function(req, res, next) {

    db.one("SELECT slug,name FROM organisations WHERE slug = '" + req.params.slug + "'")
    .then(function(data){
    	res.json(data)
    })
    .catch(function(error){
    	next(error)
    })


});

// UPDATE
router.put('/', function(req, res, next) {

	var slug = req.body.slug;
	var query = ['UPDATE organisations'];
	query.push('SET');

	var fields = ['name','precedence']
	var set = []
	var data = []
	var i = 0;
	fields.forEach(function (key) {
		if(req.body[key]){
			set.push(key + ' = ($' + (i + 1) + ')');
			data.push(req.body[key]);
			i++;
		}
	});

	query.push(set.join(', '))
	query.push("WHERE slug = '" + slug + "'")
	query = query.join(' ')

	db.tx(function(t){
		var update = this.none(query,data)
		var select = this.any(defaultSelect)
		return this.batch([update,select])
	})
	.then(function(data){
    	return res.json(data[1])
    })
    .catch(function(error){
    	next(error)
    })

});


// DELETE
router.delete('/:slug', function(req, res, next) {
	
	var slug = req.params.slug


	db.tx(function(t){
		var del = this.none('DELETE FROM organisations WHERE slug=($1)',[slug])
		var select = this.any(defaultSelect)
		return this.batch([del,select])
	})
	.then(function(data){
    	return res.json(data[1])
    })
    .catch(function(error){
    	next(error)
    })

});


module.exports=router