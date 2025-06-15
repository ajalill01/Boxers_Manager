const Coach = require('../models/coach')
const Boxer = require('../models/boxer') 
const bcrypt = require('bcrypt')
const cloudinary = require('../config/cloudinary')
const fs = require('fs').promises

const createBoxer = async(req, res) => {
    try {
        const { firstName, lastName, age, height, weight, phoneNumber } = req.body;
        const picture = req.files?.[0];
        

        if (!firstName || !lastName || !age || !height || !weight || !phoneNumber || !picture) {
            return res.status(400).json({
                success: false,
                message: 'All fields (firstName, lastName, age, height, weight, phoneNumber, picture) are required'
            });
        }


        const uploadDir = 'profilepictures';
        await fs.mkdir(uploadDir, { recursive: true });


        const cloudinaryResult = await cloudinary.uploader.upload(picture.path, {
            folder: 'boxer-profiles',
            resource_type: 'image'
        });


        const newBoxer = await Boxer.create({
            firstName,
            lastName,
            age: Number(age), 
            height: Number(height),
            weight: Number(weight),
            phoneNumber: Number(phoneNumber),
            picture: {
                url: cloudinaryResult.secure_url,
                publicId: cloudinaryResult.public_id
            }
        });

        await fs.unlink(picture.path);

        res.status(201).json({
            success: true,
            message: 'Boxer created successfully',
            data: newBoxer
        });

    } catch (e) {
        console.error('Error creating boxer:', e);
        


        res.status(500).json({
            success: false,
            message: 'Failed to create boxer',
        });
    }
};

const getAllBoxers = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const boxers = await Boxer.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); 


        const total = await Boxer.countDocuments();

        res.status(200).json({
            success: true,
            count: boxers.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: boxers
        });

    } catch (error) {
        console.error('Error fetching boxers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch boxers',
            error: error.message
        });
    }
};

const getBoxer = async (req, res) => {
    try {
        const { id } = req.params;



        const boxer = await Boxer.findById(id).lean(); 

        if (!boxer) {
            return res.status(404).json({
                success: false,
                message: 'Boxer not found'
            });
        }


        res.status(200).json({
            success: true,
            data: boxer
        });

    } catch (error) {
        console.error('Error fetching boxer:', error);
        

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Malformed boxer ID'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch boxer details',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const updateBoxer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const newPicture = req.files?.[0];

        const boxer = await Boxer.findById(id);
        if (!boxer) {
            return res.status(404).json({
                success: false,
                message: 'Boxer not found'
            });
        }


        if (newPicture) {

            if (boxer.picture?.publicId) {
                await cloudinary.uploader.destroy(boxer.picture.publicId);
            }

            const cloudinaryResult = await cloudinary.uploader.upload(newPicture.path, {
                folder: 'boxer-profiles'
            });

            updates.picture = {
                url: cloudinaryResult.secure_url,
                publicId: cloudinaryResult.public_id
            };


            await fs.unlink(newPicture.path);
        }


        const updatedBoxer = await Boxer.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Boxer updated successfully',
            data: updatedBoxer
        });

    } catch (e) {
        console.log('Error updating boxer:', e);


        res.status(500).json({
            success: false,
            message: 'Error updating boxer',
            error: e.message
        });
    }
};


const deleteBoxer = async (req, res) => {
    try {
        const { id } = req.params;

        const boxer = await Boxer.findByIdAndDelete(id);
        if (!boxer) {
            return res.status(404).json({
                success: false,
                message: 'Boxer not found'
            });
        }


        if (boxer.picture?.publicId) {
            await cloudinary.uploader.destroy(boxer.picture.publicId);
        }

        res.status(200).json({
            success: true,
            message: 'Boxer deleted successfully'
        });

    } catch (e) {
        console.log('Error deleting boxer:', e);
        res.status(500).json({
            success: false,
            message: 'Error deleting boxer',
            error: e.message
        });
    }
};

module.exports = {
    createBoxer,
    getAllBoxers,
    getBoxer,
    updateBoxer,
    deleteBoxer
};