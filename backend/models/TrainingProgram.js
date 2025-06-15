const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema({
  pdfPublicId: {
    type: String,
    required: true,
    unique: true
  },
  pdfUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);