const express = require('express');
const router = express.Router();
const {
    createBoxer,
    getAllBoxers,
    getBoxer,
    updateBoxer,
    deleteBoxer} = require('../controllers/coach-controllers');
const uploadMiddleware = require('../middleware/new-pfp-middleware');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/create',authMiddleware,uploadMiddleware,createBoxer);

router.get('/getAll',authMiddleware,getAllBoxers);

router.get('/getOne/:id',authMiddleware,getBoxer);

router.patch('/update/:id',authMiddleware,uploadMiddleware,updateBoxer);

router.delete('/delete/:id',authMiddleware,deleteBoxer);

module.exports = router;