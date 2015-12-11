var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);

var defaultSelect = "SELECT id,organisations.name as organisationname,organisations.slug as organisationslug,COALESCE(targets.amount,0) as amount FROM targets RIGHT OUTER JOIN organisations ON targets.organisation = organisations.slug ORDER BY organisations.precedence ASC;";


// CREATE
router.post('/', function(req, res, next) {
	var results = [];

	var data = {
		id: req.body.id,
		name: req.body.name,
		precedence: req.body.precedence || 5
	}
    db.tx(function(t){
	    var insert = this.none("INSERT INTO targets(org, amount, donor) values($1,$2,$3);",[data.org, data.amount, data.donor])
	    var select = this.many("SELECT id,name FROM targets ORDER BY precedence ASC")
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

router.get('/:id', function(req, res, next) {

    db.one("SELECT id,name FROM targets WHERE id = '" + req.params.id + "'")
    .then(function(data){
    	res.json(data)
    })
    .catch(function(error){
    	next(error)
    })


});

// UPDATE
router.put('/', function(req, res, next) {
	
	var id = req.body.id || false;
	if(id){

		var query = ['UPDATE targets'];
		query.push('SET');

		var fields = ['amount']
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
	} else {
		var data = {
			amount: req.body.amount,
			organisation: req.body.organisation
		}
	}

	db.tx(function(t){
		if(id) {
			var update = this.none(query,data)
			var select = this.any(defaultSelect)
			return this.batch([update,select])
		} else {
			var create = this.none("INSERT INTO targets(amount,organisation) values($1,$2)",[data.amount,data.organisation])
			var select = this.any(defaultSelect)
			return this.batch([update,select])
		}
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
		var del = this.none('DELETE FROM targets WHERE id=($1)',[id])
		var select = this.many('SELECT * FROM targets')
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