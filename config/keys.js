module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.flash('error_msg', 'Please log in to see the dashboard !')
            res.redirect('/users/login')
        }
    },
    'googleAuth': {
        'clientID': '1073883148852-lv2jpmech37n49cbr34g6sosema0m2f7.apps.googleusercontent.com',
        'callbackURL' : 'http://localhost:8080/auth/google/redirect',
        'clientSecret': '14aD0OKEJZ-7ytuzFI6MDpLn',
        'profileFields' : ['id', 'email', 'name'],
    },
}
