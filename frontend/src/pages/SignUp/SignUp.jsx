import { useState } from "react"
import Navbar from '../../components/Navbar/Navbar'
import Password from '../../components/Input/Password'
import {Link, useNavigate} from 'react-router-dom'
import { validateEmail } from "../../utils/helper"
import axiosInstance from "../../utils/axiosinstance"

export default function SignUp(){
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = async(e)=>{
        e.preventDefault();

        if(!fullName.trim()){
            setError("Please enter your full name!");
            return;
        }
        if(!validateEmail(email)){
            setError('Please enter a valid emali address!')
            return;
        }
        if(!password){
            setError('Please enter a password!');
            return;
        }

        setError('');
        setIsLoading(true);

        try{
            const response = await axiosInstance.post('/create-account', {
                fullName: fullName,
                email: email,
                password: password,
                profileImageUrl: '' //optional field
            })
            if(response.data && response.data.accessToken){
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard');
            }
        }
        catch(error){
            if(error.response?.data?.message){
                setError(error.response.data.message);
            }else{
                setError(error.response.data.message);
            }
        }
        finally{
                setIsLoading(false)
            }
    }
    return(
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar/>

            <div className="flex flex-grow overflow-hidden">
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:py-12 lg:py-3.512 lg:py-16 bg-[#DCFCE7]">
                        <div className="w-full max-w-md">
                                <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100">
                                    signup
                                </div>

                        </div>
                </div>
            </div>
        </div>
    )
}