const jwt = require('jsonwebtoken');
const Coach = require('../models/coach'); 

const authMiddleware = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(' ')[1]; 
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied"
            });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        const coach = await Coach.findById(decoded.coachId);
        
        if (!coach) {
            return res.status(401).json({
                success: false,
                message: "Coach not found, token invalid"
            });
        }

        req.coach = coach;
        req.token = token;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired, please log in again"
            });
        }

        res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};

module.exports = authMiddleware;