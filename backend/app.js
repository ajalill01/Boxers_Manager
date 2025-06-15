const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();


const consectDB=require("./database/db.js");

// const addCoach = require('./controllers/add-coach')
const coachRoutes = require('./routes/coach-routes')
const authRoutes = require('./routes/auth-routes')
const trainingRoutes = require('./routes/trainingRoutes')

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/coach',coachRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/train',trainingRoutes)

const PORT= process.env.PORT||3000;


consectDB();
app.listen(PORT,()=>{
    console.log("server is on");
});
// addCoach()
