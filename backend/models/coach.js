const mongoose = require('mongoose')

const coachSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        trim : true,
        lowercase : true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        index : true,
        required : true
    },
    password : {
        type : String,
        trim : true,
        select : false,
        minlength : 8,
        required : true
    }
},{timestamps : true})


module.exports = mongoose.model('Coach',coachSchema)