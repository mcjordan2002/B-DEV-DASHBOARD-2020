const keys = require('../config/keys')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use('login', 
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            User.findOne({ 'local.email': email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'This email is not signuped.'})
                    }
                    bcrypt.compare(password, user.local.password, (err, isMatch) => {
                        if (err) throw err
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'This password is not correct.'})
                        }
                    })
                }).catch(err => console.log(err))
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
    passport.use(new GoogleStrategy({
        clientID        : keys.googleAuth.clientID,
        clientSecret    : keys.googleAuth.clientSecret,
        callbackURL     : keys.googleAuth.callbackURL

    },
    function(token, refreshToken, profile, done) {
        console.log(profile)
        process.nextTick(function() {
            User.findOne({ 'google.id': profile.id }, function(err, user) {
                if (err)
                    return done(err)
                if (user) {
                    return done(null, user)
                } else {
                    var newUser = new User()
                    newUser.google.id = profile.id
                    newUser.google.token = token
                    newUser.google.name  = profile.displayName
                    newUser.save(function(err) {
                        if (err)
                            throw err
                        return done(null, newUser)
                    })
                }
            })
        })
    }))
}