import mongoose from 'mongoose'
import { use } from 'react'

const userSchema = new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    createdOn:{
        type:Date,
        default: new Date().getTime()
    }
},{timestamps:true})

const User = mongoose.model("User", userSchema);
export default User;