const express = require('express');
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const app = express();
const passport = require('passport')

const db = 'mongodb+srv://jordan:cVcw5rrby4jiVKgG@clust-area.rbl8o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.set('useCreateIndex', true)
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("Mongoose connected ! :)"))
  .catch(err => console.log)

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use(express.static(__dirname + '/public'));

app.listen(8080, () => {
  console.log('Dashboard listening on port 8080!');
});
