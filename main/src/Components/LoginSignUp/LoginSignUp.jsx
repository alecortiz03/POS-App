import React from "react";
import './LoginSignUp.css';

import userIcon from '../Assets/Icons/usernameIcon.png';
import passwordIcon from '../Assets/Icons/passwordIcon.png';
import Logo from '../Assets/Icons/MainIcon.png';


const LoginSignUp = () => {
  return (
    <div className="container">
        <div className="leftSide">
            <div className="underline"></div>
            <div className="inputs" id="loginSignUpSection">
                <img src={Logo} alt="Logo" id="mainLogo"/>

                <div className="input" id="usernameInput">
                    <img src={userIcon} alt="" id="usernameIcon"/>
                    <input type="text" placeholder="Username" id="usrInpt"/>
                </div>
                <div className="input" id="passwordInput">
                    <img src={passwordIcon} alt="" id="passwordIcon"/>
                    <input type="password" placeholder="Password" id="pswdInpt"/>
                </div>
            </div>
            <div className="forgotPasswordLink">
                    <a  href="">Forgot Password? <span>Click Here!</span></a>
            </div>
            <div className="loginSignUpButtons">
                <button className="submitBtn" id="loginBtn">Login</button>
                <button className="submitBtn" id="signUpBtn">Sign Up</button>
            </div>
        </div>
    </div>
  );
}

export default LoginSignUp;