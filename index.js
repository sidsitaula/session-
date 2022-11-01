const express=require('express')
var app = express()
var session = require('express-session')
const sqlite3 = require('sqlite3').verbose();
var flash = require('connect-flash');
var SQLiteStore = require('connect-sqlite3')(session);


let db = new sqlite3.Database('./db/sessions.db');

let sql = `SELECT * FROM 'sessions';;`;



app.use(session({
  secret: 'keyboard cat',
  name: 'sidgg', // Customise the name to 'test'
  resave: false,
  saveUninitialized: false,
  store:new SQLiteStore({
    db: 'sessions.db', dir: './db'
  }),
  cookie:{
    maxAge:25000
  }
  }))
  app.use(flash());

// Access the session as req.session
app.get('/', function(req, res, next) {
  if(!req.session.msg){
    req.session.msg="king"
    return res.json({msg:"huhu"})
  }
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
    console.log('---end---')
  });

  return res.json({msg:req.session.msg})
})

app.get('/login', function(req, res, next) {
  req.session.isAuth=true;
  req.session.msg="GOOD";
  req.session.cookie.maxAge=25000
  return res.json({msg:'logged in'})
})

app.get('/secret', function(req,res,next){
  if(!req.session.isAuth){
    req.flash('err','not authenticated');
    return res.json({err:req.flash('err')});
  }
  console.log(req.flash('info'))
  return res.json({msg:"welcome"})
})

app.get('/logout', function(req,res,next){
  req.session.destroy();
  res.clearCookie('sidgg')
  return res.send("Logged out")
})

app.listen(3000)