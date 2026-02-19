import Navbar from '../../Components/Navbar';
import '../CSS/Customers.css';
import React, { useState, useEffect } from 'react';
import CustomerSearchBar from '../../Components/CustomerSearchBar';

const Customers = () => {
    const [showCustomerPopup, setShowCustomerPopup] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customerData, setCustomerData] = useState({
        first_name: '',
        last_name: '',
        display_name: '',
        phone: '',
        email: '',
        address_line1: '',
        address_line2: '',
        city: '',
        province_state: '',
        postal_code: '',
        country: ''
    });

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const userUID = localStorage.getItem('userUID');
        
        if (!userUID) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/customers/getcustomers?uid=${userUID}`);
            const data = await res.json();
            
            if (data.success) {
                setCustomers(data.customers || []);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleAddCustomerClick = () => {
        setShowCustomerPopup(true);
    };

    const handleCancelClick = () => {
        setShowCustomerPopup(false);
        setCustomerData({
            first_name: '',
            last_name: '',
            display_name: '',
            phone: '',
            email: '',
            address_line1: '',
            address_line2: '',
            city: '',
            province_state: '',
            postal_code: '',
            country: ''
        });
    };

    const handleInputChange = (field, value) => {
        setCustomerData({ ...customerData, [field]: value });
    };

    const handleSaveClick = async () => {
        const userUID = localStorage.getItem('userUID');
        
        if (!userUID) {
            alert('User not logged in');
            return;
        }

        try {
            const res = await fetch('http://127.0.0.1:5000/api/customers/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    OwnerUID: parseInt(userUID),
                    ...customerData
                })
            });
            
            const data = await res.json();
            
            if (data.success) {
                alert('Customer added successfully!');
                handleCancelClick();
                fetchCustomers(); // Refresh the customer list
            } else {
                alert(data.message || 'Failed to add customer');
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('Failed to add customer');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="customer-container">
    <button className="customerButton" onClick={handleAddCustomerClick}>
        Add Customer
    </button>

    {customers.map((customer) => {

        const first = customer.first_name || "";
        const last = customer.last_name || "";
        const fullName = `${first} ${last}`.trim();

        const username =
            customer.display_name && customer.display_name.trim() !== ""
                ? customer.display_name
                : null;

        return (
            <button
                key={customer.customer_id}
                className="customerUserButton"
            >
                {fullName}
                <p>{username}</p>
            </button>
        );
    })}
</div>


            {showCustomerPopup && (
                <>
                    <div className="popup-overlay"></div>
                    <div className="popup customer-popup">
                        <h2>Add Customer</h2>
                        
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={customerData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={customerData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Display Name (Optional)" 
                            value={customerData.display_name}
                            onChange={(e) => handleInputChange('display_name', e.target.value)}
                        />
                        
                        <input 
                            type="tel" 
                            placeholder="Phone (Optional)" 
                            value={customerData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                        
                        <input 
                            type="email" 
                            placeholder="Email (Optional)" 
                            value={customerData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Address Line 1 (Optional)" 
                            value={customerData.address_line1}
                            onChange={(e) => handleInputChange('address_line1', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Address Line 2 (Optional)" 
                            value={customerData.address_line2}
                            onChange={(e) => handleInputChange('address_line2', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="City (Optional)" 
                            value={customerData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Province/State (Optional)" 
                            value={customerData.province_state}
                            onChange={(e) => handleInputChange('province_state', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Postal Code (Optional)" 
                            value={customerData.postal_code}
                            onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Country (Optional)" 
                            value={customerData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                        />
                        
                        <button onClick={handleCancelClick}>Cancel</button>
                        <button id="saveButton" onClick={handleSaveClick}>Save</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Customers;