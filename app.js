const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
const assert = require('assert');
var express = require('express');
var bodyParser = require('body-parser');
// var mongo = require('mongodb');
var http = require('http');

var app = express();
    // db = new mongo.Db('myapp', new mongo.Server( 'localhost', 27017, { auto_reconnect: true } )),
    // people = db.collection('people');
    //

const url = 'mongodb://localhost:27017';

const dbName = 'myproject';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const insertDocuments = function(db, doc, callback) {
  const collection = db.collection('documents');

  collection.insert( doc, function(err, result) {
    // assert.equal(err, null);
    if(err) throw err;
    callback(result);
  });

}

const findDocuments = function(db, callback) {
  const collection = db.collection('documents');

  collection.find().toArray(function(err, docs) {
    // assert.equal(err, null);
    if(err) throw err;
    callback(docs);
  });
}

const findUser = function(db, id, callback) {
  const collection = db.collection('documents');

  collection.findOne({ _id: new mongo.ObjectId(id) }, (function(err, doc) {
    // assert.equal(err, null);
    if(err) throw err;
    callback(doc);
  }));
}

const updateUser = function(db, id, doc, callback) {
  const collection = db.collection('documents');

  collection.update(
    { _id: new mongo.ObjectId( id) },
    doc,
    function(err, doc) {
      // assert.equal(err, null);
      if(err) throw err;
      callback(doc);
    }
  );
}




// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  // assert.equal(null, err);
  if(err) throw err;
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // GET /
  app.get('/', function( req, res ) {
    findDocuments(db, function( docs ) {
      console.log('initssdsdf');
      res.render('index.jade', {people: docs });
      client.close();
    });
  });


  // GET /new
  app.get('/new', function( req, res ) {
    res.render('index.jade', {people: [] });
  });

  // POST /new
  app.post('/new', function( req, res ) {

    let doc = { name: req.body.name, job: req.body.job };

    insertDocuments(db, doc, function() {
      // res.send('/new');
      console.log('inser documents...');
      res.redirect('/');
      // res.render('index.jade', {people: [] });
    });
  });

  // GET /update/:id
  app.get('/update/:id', function( req, res ) {

    let id = req.params.id;

    findUser( db, id, function ( doc ) {
      // res.send(doc);
      res.render('update.jade', { person: doc });
      client.close();
    });
  });


  // POST /update/:id
  app.post('/update/:id', function( req, res ) {

    let id = req.params.id;

    let doc = { name: req.body.name, job: req.body.job };

    updateUser( db, id, doc, function () {
      console.log('doc---' );
      console.log(doc );
      res.send('user updated');

      // res.render('update.jade', { person: doc });
      client.close();
    });
  });

});

http.createServer(app).listen(3000)

module.exports = app;


