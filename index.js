const express=require('express')
const redis=require('redis')
var app = express()
var session = require('express-session')
const sqlite3 = require('sqlite3').verbose();

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
  }))

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
  req.session.cookie.maxAge=5000
  return res.json({msg:req.session.msg})
})

app.listen(3000)