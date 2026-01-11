import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './database/db.js';

dotenv.config();//
const port = process.env.PORT || 5000;
const app = express();//instantiate express application

//middlewares
app.use(cors());//let server specify who can access to server
app.use(express.json());

//Home route
app.get('/',(req, res)=>{
    res.send("Server is running");
})

//Start Server
connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running at port ${port}`);
    })
})
