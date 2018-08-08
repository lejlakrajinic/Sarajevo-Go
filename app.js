const express = require('express')
const app = express()

const bodyparser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
var MongoId = require('mongodb').ObjectID;
var database;

app.use(express.static('static'))

app.post('/user', function(req, res){
    req.body._id = null;
    console.log(req.body);
    var user = req.body;
    database.collection('users').insert(user, function(err, data){
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    })
});

app.get('/user', function(req, res){
    database.collection('users').find().toArray((err, users) => {
        if (err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(users);
    })
});

app.put('/user/:user_id', function(req, res){    
    database.collection('users').findAndModify(
       {_id: new MongoId(req.params.user_id)}, // query
       [['_id','asc']],  // sort order
       {$set : {name: req.body.name, email: req.body.email, password: req.body.password}}, // replacement, replaces only the field "hi"
       function(err, doc) {
           if (err){
               console.warn(err.message);  // returns error if no matching object found
           }else{
               res.json(doc);
           }
       });
});

app.delete('/user/:user_id', function(req, res){
    database.collection('users').remove({_id: new MongoId(req.params.user_id)},
    function(err, data){
        res.json(data);
    });
});

MongoClient.connect('mongodb://localhost:27017/gosarajevo', function(err, client) {
    if (err) throw err;

    database = client.db('gosarajevo');
    app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))
});