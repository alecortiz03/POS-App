import React from "react";
import { useState } from "react";
import '../Pages/CSS/productDashboard.css';
const ProductDashboard = () => {
    const [buttons, setButtons] = useState([1]); // start with 1

    const addButton = () => {
        setButtons((prev) => {
        if (prev.length >= 9) return prev; 
        return [...prev, prev.length + 1];
        });
    };
    return (
        <div>
            <button onClick={addButton}>Add button</button>

            <div className="grid">
                {buttons.map((num) => (
                <button key={num} className="gridButton">
                    {num}
                </button>
                ))}
            </div>
        </div>
    );
}

export default ProductDashboard;