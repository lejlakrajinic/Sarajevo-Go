// const express = require('express');
// const bodyparser = require('body-parser');
// const app = express();
// app.use(bodyparser.urlencoded({extended: true}));

// const MongoClient = require('mongodb').MongoClient;
// var MongoId = require('mongodb').ObjectID;
// var database;

// app.use(express.static('static'))

// app.get('/user', function(req, res){
//     database.collection('users').find().toArray((err, users) => {
//         if (err) return console.log(err);
//         res.setHeader('Content-Type', 'application/json');
//         res.send(users);
//     })
// });
// /*

// */


// MongoClient.connect('mongodb://localhost:27017/gosarajevo', function(err, client) {
//     if (err) throw err;
//     database = client.db('gosarajevo');
//     app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))
// });

var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('localhost:27017/gosarajevo',['users']);
 var body_parser = require('body-parser');
 app.use(body_parser.json());

app.use(express.static(__dirname + '/static'));

app.get('/users', function(req,res){
  db.users.find(function(err,docs){
    res.json(docs)
})
});

app.post('/users', function(req, res){
    console.log("Hello form post")
    var user = req.body;
    db.collection('users').insert(user, function(err, data){
        if(err) return console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    })
});

app.delete('/users/:user_id', function(req, res){
    db.users.remove({'_id': db.ObjectId(req.params.user_id)}, function(err, docs) {
        if (err) return err;
        res.send(docs); // see results
    });
     });

 app.put('/users/:user_id', function(req, res){  
    console.log('2')  
    db.collection('users').findAndModify(
       {'_id': new db.ObjectId(req.params.user_id)},
        [['_id','asc']], 
        {$set : {name: req.body.name, email: req.body.email, password: req.body.password}},
        function(err, doc) {
            if (err){
                console.warn(err.message);  
            }else{
                res.json(doc);
            }
        });
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))