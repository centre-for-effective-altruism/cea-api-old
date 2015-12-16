if(!process.env.DATABASE_URL){
  require('dotenv').load();
}

var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.query('CREATE TABLE passwordless ( id serial NOT NULL, uid character varying(160), token character varying(60) NOT NULL, origin text, ttl bigint, CONSTRAINT passwordless_pkey PRIMARY KEY (id), CONSTRAINT passwordless_token_key UNIQUE (token), CONSTRAINT passwordless_uid_key UNIQUE (uid) )',function(){
	client.end();
})