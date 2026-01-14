import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App(){
  return(
    <div className="bg-red-500">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
     
    </div>
  )
};