var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

// var nunjucks = require('nunjucks');
// nunjucks.configure('./', {
//     autoescape: true,
//     express: app
// });


var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy(
  	function(username, password, done) {
  // insert your MongoDB check here. For now, just a simple hardcoded check.
	  console.log("# passport", username, password);
	  

    require('./db').authAccount({username : username,password : password},function(result,rtn_user){
      var user = {
        username : username,
        password : password,
        id : 'ObjectId('+rtn_user._id+')',
        info : rtn_user.info
      }
      if(result){
        done(null, user);
      }else{
        done(null, false);
      }
    });
}));

passport.serializeUser(function(user, done) { 
  // please read the Passport documentation on how to implement this. We're now
  // just serializing the entire 'user' object. It would be more sane to serialize
  // just the unique user-id, so you can retrieve the user object from the database
  // in .deserializeUser().
  console.log("# serializeUser", user);
  done(null, user);
});

passport.deserializeUser(function(user, done) { 
	console.log("# deserializeUser", user);
  // Again, read the documentation.
  done(null, user);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
// app.set('views', __dirname + '/views/partials');
var ejs = require('ejs');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json 
app.use(bodyParser.json())

app.use(express.static('viewModels'));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// set static resource  
app.use(express.static('bower_components'));


// Define routes.
app.get('/',
  function(req, res) {
    console.log("home",req.user);
    if(req.user){
      res.redirect('/profile');
    }else{
      res.render('pages/home', { user: req.user });
    }
    // res.render('pages/home', { user: req.user });
    // res.render('pages/example');
  });

app.get('/login',
  function(req, res){
    res.render('pages/login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureFlash: true }),
  function(req, res) {
    console.log(res.body);
    res.redirect('/');
  });

app.get('/register', 
  function(req, res) {
    res.render('pages/register');
  });

app.post('/register', 
  function(req, res) {
    console.log(req.body);
    var acc = req.body;
    require('./db').addAccount(acc,function(){
      res.redirect('/');
    });
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('pages/profile', { user: req.user });
  });



app.listen(3000, function(){
	console.log("start server.")
  require('./db').checkAdminData();
});