import axios from 'axios'
import { Server_URL } from './constants'

// custom axios instance
const axiosInstance = axios.create({
    baseURL: Server_URL,
    timeout:10000, //10 sec
    headers:{
        "Content-Type":"application/json"
    }
})

//interceptor checks if a token exists in localStorage.
//if found then it adds Authorization: Bearer <token> to the request headers.
//This way, every request automatically includes the token for authentication

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

export default axiosInstance;