import React, { useState } from "react";
import Logo from '../Pages/Assets/Icons/MainIcon.png';
import menuIcon from '../Pages/Assets/Icons/menuIcon.png';
import '../Pages/CSS/Navbar.css';
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(prev => !prev);

    const logOut = () => {
        navigate("/");
    }
    const customersClick = () => {
        navigate("/customers");
    }
    const homeClick = () => {
        navigate("/dashboard");
    }
    
    return(
    <>
    {isOpen && (
      <div
        className="backdrop"
        onClick={() => setIsOpen(false)}
      />
    )}

    <div className="mainMenu">
      <nav>
        <button id="menuButton" onClick={toggleMenu}>
          <img src={menuIcon} alt="Menu Icon" id="menuIcon" />
        </button>
        <img src={Logo} alt="Logo" id="navLogo" />
      </nav>

      <div id="menuBody" className={isOpen ? "open" : "closed"}>
        <div className="burgerClass">
          <button className="navButton" onClick={homeClick}>Home</button>
        </div>
        <div className="burgerClass">
          <button className="navButton" onClick={customersClick}>Customers</button>
        </div>
        <div className="burgerClass">
          <button className="navButton" onClick={logOut}>Log Out</button>
        </div>
      </div>
    </div>
  </>
    )

}

export default Navbar;