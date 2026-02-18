import React from "react";
import { useState } from "react";
import ProductLayout from "./ProductLayout";
import '../Pages/CSS/productDashboard.css';
import Searchbar from "./Searchbar";

const ProductDashboard = () => {
    
    
    return (
        <div>
            <Searchbar />
            <ProductLayout />
        </div>
    );
};

export default ProductDashboard;