import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './database/db.js';
import User from './models/users.model.js';

dotenv.config();//
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
            message:"Account created sucessfully"
        })
    } catch (error) {
        return res.status(500).json({message:`SignUp error ${error}`});
    }
})

//Start Server
connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running at port ${port}`);
    })
})
