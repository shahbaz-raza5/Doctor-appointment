const express=require('express')
const colors=require('colors')
const morgan=require('morgan')
const path = require('path');
const dotenv=require('dotenv')
const connectDB=require('./configs/db')


dotenv.config()

connectDB()
const app=express();

app.use(express.json())
app.use(morgan('dev'))

//routes

app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/doctor', require('./routes/doctorRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//Listen port   

const port=process.env.PORT || 8080 

app.listen(port,()=>{
    console.log(`Server is listen at ${process.env.PORT} at ${process.env.DEV_MODE}`.bgGreen.white);
    
})