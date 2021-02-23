
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const bodyParser = require('body-parser')
const User = require('../models/User')

require('../config/passport')(passport)
router.use(bodyParser.json())
router.get('/login', (req, res) => res.render('login'));
router.get('/signup', (req, res) => res.render('signup'));
router.post('/login', (req, res, next) => {
    passport.authenticate('login', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})
router.post('/signup', (req, res) => {
    const {name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill all the fields.'})
    }

    if (password !== password2) {
        errors.push({msg: 'Passwords not matching.'})
    }

    if (password.length < 6) {
        errors.push({msg: 'Password should be at least 6 characters.'})
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            name, 
            email,
            password,
            password2
        });
    } else {
        //Good
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //The user exists
                    errors.push({msg: "Email is already taken."})
                    res.render('signup', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User()
                    newUser.local.email = email
                    newUser.local.name = name
                    newUser.local.password = password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.local.password, salt, (err, hash) => {
                            newUser.local.password = hash
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now signuped ! You can log in !')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                    }))
                }
            });
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;