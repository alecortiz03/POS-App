import React from "react";
import { useState } from "react";
import ProductLayout from "./ProductLayout";
import '../Pages/CSS/productDashboard.css';
import Searchbar from "./Searchbar";
import ShoppingCart from "./ShoppingCart";

const ProductDashboard = () => {
    
    
    return (
        <div>
            <div className="SearchBarContainer">
            <Searchbar />
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