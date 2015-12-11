var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);


// CREATE
router.post('/', function(req, res, next) {
	var results = [];

	var data = {
		name: req.body.name,
	}
    db.tx(function(t){
	    var insert = this.none("INSERT INTO donors(name) values($1);",[data.name])
	    var select = this.many("SELECT id,name FROM donors ORDER BY name ASC")
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

    db.many("SELECT id,name FROM donors ORDER BY name ASC;")
    .then(function(data){
    	res.json(data)
    })
    .catch(function(error){
    	next(error)
    })


});

router.get('/:id', function(req, res, next) {

    db.one("SELECT id,name FROM organisations WHERE id = '" + req.params.id + "'")
    .then(function(data){
    	res.json(data)
    })
    .catch(function(error){
    	next(error)
    })


});

// UPDATE
router.put('/', function(req, res, next) {
	
	var id = req.body.id;
	var query = ['UPDATE donors'];
	query.push('SET');

	var fields = ['name']
	var set = []
	var data = []
	fields.forEach(function (key, i) {
		if(req.body[key]){
			set.push(key + ' = ($' + (i + 1) + ')');
			data.push(req.body[key])
		}
	});

	query.push(set.join(', '))
	query.push("WHERE id = '" + id + "'")
	query = query.join(' ')
	console.log(query,data)

	db.tx(function(t){
		var update = this.none(query,data)
		var select = this.many('SELECT * FROM donors ORDER BY name ASC')
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
router.delete('/:id', function(req, res, next) {
	
	var id = req.params.id

	db.tx(function(t){
		var del = this.none('DELETE FROM donors WHERE id=($1)',[id])
		var select = this.any('SELECT * FROM donors ORDER BY name ASC')
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