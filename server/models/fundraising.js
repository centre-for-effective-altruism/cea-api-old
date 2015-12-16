if(!process.env.DATABASE_URL){
  require('dotenv').load();
}

var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.query('begin');
// client.query('DROP TABLE IF EXISTS organisations,targets,donations,donors');
// client.query('CREATE TABLE organisations(slug VARCHAR(40) PRIMARY KEY, name VARCHAR(40) not null, precedence int)');
// client.query('CREATE TABLE donors(id SERIAL PRIMARY KEY, name VARCHAR(80))');
// client.query('CREATE TABLE donations(id SERIAL PRIMARY KEY, organisation VARCHAR(40) references organisations (slug), amount NUMERIC(10,2), donor int references donors (id), anonymous BOOLEAN DEFAULT FALSE, timestamp TIMESTAMP)');
client.query('DROP TABLE IF EXISTS targets');
client.query('CREATE TABLE targets(id SERIAL PRIMARY KEY, organisation VARCHAR(40) references organisations (slug), amount NUMERIC(10,2) )');
client.query('commit', function() { client.end(); });