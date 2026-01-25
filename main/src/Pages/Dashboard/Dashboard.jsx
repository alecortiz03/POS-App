import menuIcon from '../Assets/Icons/menuIcon.png';
import Logo from '../Assets/Icons/MainIcon.png';
import '../CSS/Dashboard.css';

const Dashboard = () => {
  return (
  <div className="menuBar">
    <img src={menuIcon} alt="Menu Icon" id="menuIcon"/>
    <img src={Logo} alt="Logo" id="dashboardLogo"/>
  </div>
);
};

export default Dashboard;
