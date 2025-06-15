const mongoose = require('mongoose')

const boxerSchema = new mongoose.Schema({
    firstName : {
        type : String,
        trim : true,
        required : true,
        index : true
    },
    lastName : {
        type : String,
        trim : true,
        required : true,
        index : true
    },
    age:{
        type :Number,
        required : true
    },
    picture : {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
    height : {
        type : Number,
        required : true
    },
    weight : {
        type : Number,
        required : true
    },
    phoneNumber : {
        type : Number,
        length : 10,
        required : true
    }
},{timestamps : true})

module.exports = mongoose.model('Boxer',boxerSchema)