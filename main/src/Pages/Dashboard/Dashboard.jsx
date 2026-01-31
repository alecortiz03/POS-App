import menuIcon from '../Assets/Icons/menuIcon.png';
import Logo from '../Assets/Icons/MainIcon.png';
import '../CSS/Dashboard.css';
import Navbar from '../../Components/Navbar';
import ProductDashboard from '../../Components/ProductDashboard';

const Dashboard = () => {
  return (
  <div className="menuBar">
    <Navbar />
    <ProductDashboard />
  </div>
);
};

export default Dashboard;
