import express from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import connectDB from './database/db.js';
import User from './models/users.model.js';
import authenticateToken from './utilities.js'

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();//instantiate express application

//middlewares
const allowedOrigins = ["http://localhost:5173"]; //frontend url
app.use(cors({
    origin: allowedOrigins,
    credentials:true
}));//let server specify who can access to server
app.use(express.json());

//Home route
app.get('/',(req, res)=>{
    res.send("Server is running");
});

app.post("/create-account", async(req, res)=>{
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required!"});
    }
    try {
        const isUser = await User.findOne({email});
        if(isUser){
            return res.status(400).json({message:"User already exists!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            password: hashedPassword
        })
        await user.save();

        const accessToken = jwt.sign({userId:user._id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: "7d"});

        return res.status(201).json({
            message:"Account created sucessfully",
            accessToken
        })
    } catch (error) {
        return res.status(500).json({message:`SignUp error ${error}`});
    }
})

app.post("/login", async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"Email and password and password are required!"});
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password!"})
        }
        const accessToken = jwt.sign({userId:user._id}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"7d"});
        return res.status(200).json({
            message:"Login sucessfully!",
            accessToken
        })

    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`});
    }
})

app.get("/get-user", authenticateToken, async(req, res)=>{
    try {
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(401).json({message:"User not found!"})
        }

        return res.json({
            user:{
                fullName:user.fullName,
            email:user.email,
            _id:user._id,
            createdOn:user.createdOn
            },
            message:"Sucessfully got user data!"
        })
    } catch (error) {
        return res.status(500).json({message:`Failed to get user ${error}`})
    }
})

//Start Server
connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running at port ${port}`);
    })
})
