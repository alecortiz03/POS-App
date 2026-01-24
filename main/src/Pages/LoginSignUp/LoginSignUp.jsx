import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


import './LoginSignUp.css';

import userIcon from '../Assets/Icons/usernameIcon.png';
import passwordIcon from '../Assets/Icons/passwordIcon.png';
import Logo from '../Assets/Icons/MainIcon.png';

import { getLoginMessage, getSignUpMessage } from "../LoginSignUp/Logic.js";


/* CONSTANTS*/



const LoginSignUp = () => {
    const [message, setMessage] = useState("")
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLoginClick = async () => {
    try {
        const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (data.success){
            navigate("/dashboard");
            return;
        }
        setMessage(data.message);
    } catch (err) {
        setMessage("Could not reach backend. Is Flask running?");
    }
    };


    const handleSignUpClick = () => {
    navigate("/signup");
    };
  return (
    <div className="container">
        <div className="leftSide">
            <div className="underline"></div>
            <div className="inputs" id="loginSignUpSection">
                <img src={Logo} alt="Logo" id="mainLogo"/>
                {message && <p className="statusMessage">{message}</p>}
                <div className="input" id="usernameInput">
                    <img src={userIcon} alt="" id="usernameIcon"/>
                    <input type="text" placeholder="Username" id="usrInpt" value = {username} onChange = { (e) => setUsername(e.target.value)}/>
                </div>
                <div className="input" id="passwordInput">
                    <img src={passwordIcon} alt="" id="passwordIcon"/>
                    <input type="password" placeholder="Password" id="pswdInpt" value = {password} onChange = { (e) => setPassword(e.target.value)}/>
                </div>
            </div>
            <div className="forgotPasswordLink">
                    <a  href="">Forgot Password? <span>Click Here!</span></a>
            </div>
            <div className="loginSignUpButtons">
                <button className="submitBtn" id="loginBtn" onClick={handleLoginClick}>Login</button>
                <button className="submitBtn" id="signUpBtn" onClick={handleSignUpClick}>Sign Up</button>
            </div>
        </div>
    </div>
  );
}

export default LoginSignUp;


