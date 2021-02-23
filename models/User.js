const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    local : {
        name: String,
        email: String,
        password: String,
    },
    google : {
        id : String,
        token : String,
        name : String,
    },
    yammer : {
        id : String,
        token : String,
        name : String,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User