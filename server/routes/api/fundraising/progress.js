var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);

router.get('/',function(req, res, next) {

	var sql = []
	sql.push('SELECT')
	sql.push('organisations.name as organisationname, organisations.slug as organisationslug, COALESCE(d.donations,0) as donations, COALESCE(targets.amount,0) as target, COALESCE(targets.amount,0)-COALESCE(d.donations,0) as difference, ROUND((COALESCE(d.donations,0)/COALESCE(targets.amount,1))*100,2) as progress');
	sql.push('FROM organisations')
	sql.push('LEFT OUTER JOIN targets ON organisations.slug = targets.organisation');
	sql.push('LEFT OUTER JOIN (SELECT SUM(amount) as donations, organisation FROM donations GROUP BY organisation) AS d ON organisations.slug =d.organisation')
	sql.push('ORDER BY organisations.precedence')


	db.any(sql.join(' '))
    .then(function(data){
    	res.json(data[])
    })
    .catch(function(error){
    	next(error)
    })
})

router.get('/:slug',function(req, res, next) {

	var sql = []
	sql.push('SELECT')
	sql.push('organisations.name as organisationname, organisations.slug as organisationslug, COALESCE(d.donations,0) as donations, COALESCE(targets.amount,0) as target, COALESCE(targets.amount,0)-COALESCE(d.donations,0) as difference, ROUND((COALESCE(d.donations,0)/COALESCE(targets.amount,1))*100,2) as progress');
	sql.push('FROM organisations')
	sql.push('LEFT OUTER JOIN targets ON organisations.slug = targets.organisation');
	sql.push('LEFT OUTER JOIN (SELECT SUM(amount) as donations, organisation FROM donations GROUP BY organisation) AS d ON organisations.slug =d.organisation')
	sql.push('WHERE organisations.slug = \'' + req.params.slug + "'")
	sql.push('ORDER BY organisations.precedence')


	db.one(sql.join(' '))
    .then(function(data){
    	res.json(data)
    })
    .catch(function(error){
    	next(error)
    })
})



module.exports = router