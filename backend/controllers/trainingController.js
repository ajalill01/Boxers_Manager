const TrainingProgram = require('../models/TrainingProgram');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;

const uploadProgram = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No PDF uploaded' 
      });
    }


    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'training-programs'
    });


    const program = await TrainingProgram.create({
      pdfPublicId: result.public_id,
      pdfUrl: result.secure_url
    });


    await fs.unlink(req.file.path);

    res.status(201).json({
      success: true,
      data: program
    });

  } catch (error) {

    if (req.file) await fs.unlink(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

const updateProgram = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No PDF uploaded' 
      });
    }

    const program = await TrainingProgram.findById(req.params.id);
    if (!program) {
      await fs.unlink(req.file.path);
      return res.status(404).json({ 
        success: false,
        message: 'Program not found' 
      });
    }


    const newPdf = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'training-programs'
    });


    await cloudinary.uploader.destroy(program.pdfPublicId);


    program.pdfPublicId = newPdf.public_id;
    program.pdfUrl = newPdf.secure_url;
    await program.save();


    await fs.unlink(req.file.path);

    res.json({
      success: true,
      data: program
    });

  } catch (error) {
    if (req.file) await fs.unlink(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Update failed',
      error: error.message
    });
  }
};

const getAllPrograms = async (req, res) => {
  try {
    const programs = await TrainingProgram.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programs',
      error: error.message
    });
  }
};


const getProgram = async (req, res) => {
  try {
    const program = await TrainingProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    res.json({
      success: true,
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch program',
      error: error.message
    });
  }
};

module.exports = { 
  uploadProgram, 
  updateProgram, 
  getAllPrograms, 
  getProgram 
};