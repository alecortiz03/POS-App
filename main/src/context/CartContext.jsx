import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Check if product already exists in cart
            const existingItem = prevItems.find(item => item.name === product.name);
            
            if (existingItem) {
                // Increment quantity if exists
                return prevItems.map(item =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item with quantity 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productName) => {
        setCartItems(prevItems => prevItems.filter(item => item.name !== productName));
    };

    const updateQuantity = (productName, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productName);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.name === productName
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getGST = () => {
        return getSubtotal() * 0.05;
    };

    const getTotal = () => {
        return getSubtotal() + getGST();
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getSubtotal,
            getGST,
            getTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
