import React from "react";
import { useCart } from "../context/CartContext";
import './ShoppingCart.css';

const ShoppingCart = () => {
    const { cartItems, removeFromCart, updateQuantity, getSubtotal, getGST, getTotal, clearCart } = useCart();

    return(
        <div className="main">
            <h1>Shopping Cart</h1>
            
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