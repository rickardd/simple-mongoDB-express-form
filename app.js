const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();

const url = 'mongodb://localhost:27017';
const dbName = 'myproject';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const insertUser = function(doc, callback) {
  MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('users');

    collection.insert( doc, function(err, doc) {
      if(err) throw err;
      callback(doc);
      client.close();
    });

  });
};

const findUsers = function(callback) {
  MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('users');

    collection.find().toArray(function(err, docs) {
      if(err) throw err;
      callback(docs);
      client.close();
    });
  });
};

const findUser = function(id, callback) {
  MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('users');

    collection.findOne({ _id: new mongo.ObjectId(id) }, (function(err, doc) {
      if(err) throw err;
      callback(doc);
      client.close();
    }));
  });
};

const updateUser = function(id, doc, callback) {
  MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('users');

    collection.update(
      { _id: new mongo.ObjectId( id) },
      doc,
      function(err, doc) {
        if(err) throw err;
        callback(doc);
        client.close();
      }
    );
  });
};

const deleteUser = function(id, callback) {
  MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    const db = client.db(dbName);
    const collection = db.collection('users');

    collection.remove( { _id: new mongo.ObjectId(id) }, function(err, doc) {
        if(err) throw err;
        callback( doc);
        client.close();
    });
  });
};


// GET /
app.get('/', function( req, res ) {
  findUsers( function( docs ) {
    res.render('index.jade', {people: docs });
  });
});

// GET /new
app.get('/new', function( req, res ) {
  res.render('index.jade', {people: [] });
});

// POST /new
app.post('/new', function( req, res ) {
  let doc = { name: req.body.name, job: req.body.job };

  insertUser(doc, function() {
    res.redirect('/');
  });
});

// GET /update/:id
app.get('/update/:id', function( req, res ) {
  let id = req.params.id;

  findUser( id, function ( doc ) {
    res.render('update.jade', { person: doc });
  });
});


// POST /update/:id
app.post('/update/:id', function( req, res ) {
  const id = req.params.id;
  const doc = { name: req.body.name, job: req.body.job };

  updateUser( id, doc, function () {
    res.redirect('/');
  });
});

// GET /delete/:id
app.get('/delete/:id', function( req, res ) {
  let id = req.params.id;

  deleteUser( id, function ( doc ) {
    res.redirect('/');
  });
});


http.createServer(app).listen(3000)

module.exports = app;


