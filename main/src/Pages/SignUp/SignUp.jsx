import '../CSS/SignUp.css';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import userIcon from '../Assets/Icons/usernameIcon.png';
import passwordIcon from '../Assets/Icons/passwordIcon.png';
import Logo from '../Assets/Icons/MainIcon.png';

const SignUp = () => {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
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
              <div className="loginSignUpButtons">
                  <button className="submitBtn" id="loginBtn">SUBMIT</button>
              </div>
          </div>
      </div>
);
};

export default SignUp;