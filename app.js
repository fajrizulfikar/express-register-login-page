const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');

var app = express();
var db = require('./db');
var port = 5000;

// parse urlnencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse json
app.use(bodyParser.json());

// session use
app.use(session({
    secret: 'run123',
    resave: false,
    saveUninitialized: true
}));

// home route
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

// register get route
app.get('/register', function(req, res){
   res.sendFile(path.join(__dirname + '/views/register.html')); 
});

// login get route
app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

// dashboard get route
app.get('/dashboard', function(req, res){
    if(req.session.loggedin) {
        var username = req.session.username;
        res.render('dashboard.ejs', {username: username});
    } else {
        res.send('Please login to view this page!');
    }
});

// dashboard logout get route
app.get('/dashboard/logout', function(req, res){
    req.session.destroy(function(err){
        if(err) throw err;
        res.redirect('/');
    });
});

// POST register route
app.post('/register', function(req, res){
  var name = req.body.fullname;
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body. email;
  
  var data = [];
  data.push([
    name,
    username,
    password,
    email
    ]);
    
  var q = "INSERT INTO accounts(name, username, password, email) VALUES ?";
   
  db.query(q, [data], function(err, results){
        if(err) throw err;
  });
  
  res.send('Thank your for registering in our page!');
});

// POST login route
app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    
    // var data = [username, password];
    
    var q = 'SELECT  username, password FROM accounts WHERE username = ? AND password = ?';
    
    if(username && password) {
        db.query(q, [username, password], function(err, results){
            if(err) throw err;
            if(results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/dashboard');
            } else {
                res.send('Inccorect username or password!');
            }
        });
    } else {
        res.send('Please enter username and password!');
    }
});

app.listen(port, function(){
    console.log('Server is connected in PORT : ' + port);
})