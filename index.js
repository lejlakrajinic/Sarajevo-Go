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

const jwt_secret = 'SJwt25Wq62SFfjiw92sR';
var mongojs = require('mongojs');
var jwt = require('jsonwebtoken');
var db = mongojs('mongodb://lejla123:margita123@ds235022.mlab.com:35022/lejlabaza', ['users']);
 var body_parser = require('body-parser');

app.use(express.static(__dirname + '/static'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
    extended: true
})); // to support URL-encoded bodies

app.use('/rest/v1/',function(request,response,next){
    jwt.verify(request.get('JWT'), jwt_secret, function(error, decoded) {   
      if (error) {
        response.status(401).send('Unauthorized access');    
      } else {
        db.users.findOne({'_id': db.ObjectId(decoded._id)}, function(error, user) {
          if (error){
            throw error;
          }else{
            if(user){
              next();
            }else{
              response.status(401).send('Credentials are wrong.');
            }
          }
        });
      }
    });  
  })

app.post('/login', function(request, response){
    var user = request.body;
  
    db.users.findOne({'email': user.email, 'password': user.password}, function(error, user) {
      if (error){
        throw error;
      }else{
        if(user){
          var token = jwt.sign(user, jwt_secret, {
            expiresIn: 20000 
          });
      
          response.send({
            success: true,
            message: 'Authenticated',
            token: token
          })
        }else{
          response.send({
              success: false,
              status: 401
          })
        }
      }
    });
  });

app.get('/rest/v1/users', function(req,res){
    db.users.find(function(err,docs){
        res.json(docs)
    })
});

app.post('/users', function(req, res){
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
    db.users.findAndModify({
        query: {
            _id: mongojs.ObjectId(req.params.user_id)
          },
          update: {
            $set: {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            }
          },
          new: true
        }, function (err, doc) {
          res.json(doc)
        
        });
});

app.listen(process.env.PORT || 4000, () => console.log('Example app listening on port 3000!'))