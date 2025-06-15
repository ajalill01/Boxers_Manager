// routes/trainingRoutes.js
const express = require('express');
const router = express.Router();
const {   uploadProgram, 
  updateProgram, 
  getAllPrograms, 
  getProgram  } = require('../controllers/trainingController');
const upload = require('../middleware/pdfUploadMiddleware');


router.post('/create', upload.single('pdf'), uploadProgram);


router.put('/update/:id', upload.single('pdf'), updateProgram);

router.get('/getAll', getAllPrograms);


router.get('/getOne/:id', getProgram);

module.exports = router;