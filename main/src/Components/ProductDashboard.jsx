import React from "react";
import { useState } from "react";
import ProductLayout from "./ProductLayout";
import '../Pages/CSS/productDashboard.css';
import Searchbar from "./Searchbar";
import ShoppingCart from "./ShoppingCart";
import { useCart } from "../context/CartContext";

const ProductDashboard = () => {
    const { addToCart } = useCart();

const handleSelectProduct = (p) => {
  addToCart({
    name: p.Name,
    price: (p.PriceCents || 0) / 100,
    pid: p.PID
  });
};
    
    return (
        <div>
            <div className="SearchBarContainer">
            <Searchbar onSelectProduct={handleSelectProduct}/>
            </div>
            <div className="dashboard-container">
                <ProductLayout />
                <div className="shoppingcart">
                  <ShoppingCart />
                  </div>
            </div>
        </div>
    );
};

export default ProductDashboard;