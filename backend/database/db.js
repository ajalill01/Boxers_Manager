const mongoose = require('mongoose')

const connectToDb = async()=>{
    try{
        mongoose.connect(process.env.DATABASE_URL)
        console.log('Database has connected successfully')
    }
    catch(e){
        console.log(e)
    }
}

module.exports = connectToDb