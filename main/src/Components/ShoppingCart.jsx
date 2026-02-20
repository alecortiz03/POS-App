import React, {useState} from "react";
import { useCart} from "../context/CartContext";
import './ShoppingCart.css';
import CustomerSearchBar from "./CustomerSearchBar";
import closeIcon from '../Pages/Assets/Icons/closeIcon.png';
import SearchBar from "./Searchbar";

const ShoppingCart = () => {
    const handleSelectProduct = (p) => {
  // p is the product object coming from your /api/suggest (full product row)
  addToCart({
    name: p.Name,                         // matches your cart's `item.name`
    price: (p.PriceCents || 0) / 100,     // convert cents to dollars
    pid: p.PID                            // optional but useful later
  });
};
    const closeCustomerCard = () => {
        setSelectedCustomer(null);
        localStorage.removeItem('selectedCustomer');
    }
    function handleCustomerSelect(customer) {

    if (!customer) {
        setSelectedCustomer(null);
        return;
    }
    setSelectedCustomer(customer);
    // You can also pass this customer info to your cart context if needed
    localStorage.setItem('selectedCustomer', JSON.stringify(customer));
}

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const { cartItems, removeFromCart, updateQuantity, getSubtotal, getGST, getTotal, clearCart, addToCart } = useCart();
    let fullName = "";
    let username = "";
    let phoneNumber = "";
    let email = "";
    if (selectedCustomer) {
        const first = selectedCustomer.first_name || "";
        const last = selectedCustomer.last_name || "";
        username = selectedCustomer.display_name || "";
        phoneNumber = selectedCustomer.phone || "";
        email = selectedCustomer.email || "";
        fullName = `${first} ${last}`.trim();
    }
    return(
        <div className="main">
            <CustomerSearchBar onSelectCustomer={handleCustomerSelect}/>
            {selectedCustomer && (
                
                <div className="selectedCustomerCard">
                    <button className="closeButton" onClick={closeCustomerCard}>X</button>
                    <h3 className="customerCardName">{fullName}</h3>
                    {username !== "" && <p className="customerCardUsername">{username}</p>}
                    {phoneNumber !== "" && <p className="customerCardPhone">{phoneNumber}</p>}
                    {email !== "" && <p className="customerCardEmail">{email}</p>}
                </div>
            )}
            
            {cartItems.length === 0 ? (
                <p className="empty-cart">No items in cart</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.name} className="cart-item">
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">${item.price.toFixed(2)}</span>
                                </div>
                                <div className="item-controls">
                                    <button 
                                        className="qty-btn" 
                                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="item-quantity">{item.quantity}</span>
                                    <button 
                                        className="qty-btn" 
                                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                    <button 
                                        className="remove-btn" 
                                        onClick={() => removeFromCart(item.name)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="item-total">
                                    Total: ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-totals">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>${getSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span>GST (5%):</span>
                            <span>${getGST().toFixed(2)}</span>
                        </div>
                        <div className="total-row final-total">
                            <span>Total:</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button className="clear-cart-btn" onClick={clearCart}>
                        Clear Cart
                    </button>
                </>
            )}
        </div>
    )
}

export default ShoppingCart;