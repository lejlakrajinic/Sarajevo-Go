const express = require('express')
const app = express()
var port = process.env.port || 3000;

app.get('/', function(req, res) {
    res.send( 'Node server is running on port');
    });

app.listen(port);