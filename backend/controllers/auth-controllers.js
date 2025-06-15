const Coach = require('../models/coach')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email||!password){
            return res.status(400).json({
                success : false,
                message : 'Please provide both email and password'
            })
        }

        const existingCoach = await Coach.findOne({email:email}).select('+password');
        if(!existingCoach){
            return res.status(400).json({
                success : false,
                message : 'Coach does not exist'
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, existingCoach.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : 'Wrong password, please try again'
            })
        }
        
        const token = jwt.sign(
            { 
                coachId : existingCoach._id,
                email : existingCoach.email,
                role: 'coach'
            },
            process.env.JWT_SECRET,
            {
                expiresIn : '30d'
            }
        )

        res.status(200).json({
            success : true,
            message : 'Logged in successfully',
            token : token
        })
    }
    catch(e){
        console.log('Error from login',e)
        res.status(500).json({
            success : false,
            message : 'Error from login',
            error : e.message 
        })
    }
}

module.exports = {login}