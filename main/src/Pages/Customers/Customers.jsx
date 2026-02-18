import Navbar from '../../Components/Navbar';
import '../CSS/Customers.css';
import React from 'react';

const Customers = () => {
    return (
        <div>
            <Navbar />
            <div>
                <button className="customerButton">Add Customer</button>
            </div>
        </div>
    )
}

export default Customers;