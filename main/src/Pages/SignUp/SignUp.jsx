import '../CSS/SignUp.css';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import userIcon from '../Assets/Icons/usernameIcon.png';
import passwordIcon from '../Assets/Icons/passwordIcon.png';
import Logo from '../Assets/Icons/MainIcon.png';
import NameIcon from '../Assets/Icons/firstNameIcon.png';
import emailIcon from '../Assets/Icons/emailIcon.png';

const SignUp = () => {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();
  const handleSignUpClick = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, username, email, password }),
        });
    const data = await res.json();
    if (data.success){
        navigate("/");
        return;
    }
    setMessage(data.message);
  };
  return (
  <div className="container">
          <div className="leftSide">
              <div className="underline"></div>
              <div className="inputs" id="SignUpSection">
                  <img src={Logo} alt="Logo" id="mainLogo"/>
                  {message && <p className="statusMessage">{message}</p>}
                  <div className="input" id="firstnameInput">
                      <img src={NameIcon} alt="" id="firstNameIcon"/>
                      <input type="text" placeholder="First Name" id="firstNameInpt" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="input" id="lastnameInput">
                      <img src={NameIcon} alt="" id="firstNameIcon"/>
                      <input type="text" placeholder="Last Name" id="lastNameInpt" value={lastname} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="input" id="emailInput">
                      <img src={emailIcon} alt="" id="emailIcon"/>
                      <input type="email" placeholder="Email" id="emailInpt" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  <div className="input" id="usernameInput">
                      <img src={userIcon} alt="" id="usernameIcon"/>
                      <input type="text" placeholder="Username" id="usrInpt" value = {username} onChange = { (e) => setUsername(e.target.value)}/>
                  </div>
                  <div className="input" id="passwordInput">
                      <img src={passwordIcon} alt="" id="passwordIcon"/>
                      <input type="password" placeholder="Password" id="pswdInpt" value = {password} onChange = { (e) => setPassword(e.target.value)}/>
                  </div>
              </div>
              <div className="SignUpButtons">
                  <button className="submitBtn" id="registerBtn" onClick={handleSignUpClick}>SUBMIT</button>
                  <button className="submitBtn" id="backToLoginBtn" onClick={ () => navigate("/")}>BACK</button>
              </div>
          </div>
      </div>
);
};

export default SignUp;