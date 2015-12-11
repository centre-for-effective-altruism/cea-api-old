var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);


var defaultSelect = 'SELECT donations.id,organisations.name as organisationname, donations.organisation as organisationslug,donations.amount,donors.name as donorName,donations.donor as donorId,donations.anonymous,donations.timestamp FROM donations INNER JOIN donors ON donations.donor = donors.id INNER JOIN organisations on donations.organisation = organisations.slug ORDER BY timestamp DESC;'

// CREATE
router.post('/', function(req, res, next) {
	var results = [];

	var data = {
		organisation: req.body.organisation,
		amount: req.body.amount,
		donor: req.body.donor,
		timestamp: req.body.timestamp
		
	}

    db.tx(function(t){
	    var insert = this.none("INSERT INTO donations(organisation, amount, donor, timestamp) values($1,$2,$3,$4);",[data.organisation, data.amount, data.donor, data.timestamp])
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
	
	var slug = req.body.slug || false;
	var query = ['UPDATE organisations'];
	query.push('SET');

	var fields = ['name','precedence']
	var set = []
	var data = []
	fields.forEach(function (key, i) {
		if(req.body[key]){
			set.push(key + ' = ($' + (i + 1) + ')');
			data.push(req.body[key])
		}
	});

	query.push(set.join(', '))
	query.push("WHERE slug = '" + slug + "'")
	query = query.join(' ')
	console.log(query,data)

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
router.delete('/:id', function(req, res, next) {
	
	var id = req.params.id

	db.tx(function(t){
		var del = this.none("DELETE FROM donations WHERE id=($1)",[id])
		var select = this.any(defaultSelect)
		return this.batch([del,select])
	})
	.then(function(data){
		console.log(data)
    	return res.json(data[1])
    })
    .catch(function(error){
    	next(error)
    })

});


module.exports=router