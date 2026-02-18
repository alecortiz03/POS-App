import React from "react";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const ProductLayout = () => {
    const { addToCart } = useCart();
    const [productMenu, setProductMenu] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: ''
    });

    // Fetch products from backend on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            const userUID = localStorage.getItem('userUID');
            
            if (!userUID) {
                console.error('No user logged in');
                return;
            }

            try {
                const res = await fetch(`http://127.0.0.1:5000/api/products?uid=${userUID}`);
                const data = await res.json();
                console.log('Fetched products:', data.products);
                if (data.success) {
                    // Map database products to match your current format
                    const formattedProducts = data.products.map((p, index) => ({
                        id: index,
                        name: p.Name,
                        
                    }));
                    setProducts(formattedProducts);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);
    // Fetch product details when burger menu is clicked
useEffect(() => {
    const fetchProductDetails = async () => {
        if (productMenu === null) {
            setSelectedProductDetails(null);
            return;
        }

        const selectedProduct = products.find(p => p.id === productMenu);
        if (!selectedProduct) return;

        const userUID = localStorage.getItem('userUID');
        
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/product?uid=${userUID}&name=${selectedProduct.name}`);
            const data = await res.json();
            
            if (data.success) {
                setSelectedProductDetails({
                    name: data.product.Name,
                    description: data.product.Description,
                    price: data.product.Price
                });
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    fetchProductDetails();
}, [productMenu, products]);
    const selectedProduct =  products.find(p => p.id === productMenu);
    const handleMenuClick = (productId, e) => {
        e.stopPropagation();
        setProductMenu(productMenu === productId ? null : productId);
    };

    const handleProductClick = async (product) => {
        // Fetch full product details before adding to cart
        const userUID = localStorage.getItem('userUID');
        
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/product?uid=${userUID}&name=${product.name}`);
            const data = await res.json();
            
            if (data.success) {
                addToCart({
                    name: data.product.Name,
                    price: parseFloat(data.product.Price),
                    description: data.product.Description
                });
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handleAddClick = () => {
        setShowPopup(true);
    };

    const handleCancelClick = () => {
        setShowPopup(false);
        setNewProduct({ name: '', description: '', price: '', quantity: '' });
    };


    const handleInputChange = (field, value) => {
        setNewProduct({ ...newProduct, [field]: value });
    };
    
    const handleSaveClick = async () => {
    if (newProduct.name.trim()) {
        const userUID = localStorage.getItem('userUID');
        
        try {
            const res = await fetch('http://127.0.0.1:5000/api/addproduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: parseInt(userUID),
                    name: newProduct.name,
                    description: newProduct.description,
                    price: newProduct.price,
                    quantity: newProduct.quantity
                })
            });
            
            const data = await res.json();
            
            if (data.success) {
                // Refresh products list by fetching again
                const productsRes = await fetch(`http://127.0.0.1:5000/api/products?uid=${userUID}`);
                const productsData = await productsRes.json();
                
                if (productsData.success) {
                    const formattedProducts = productsData.products.map((p, index) => ({
                        id: index,
                        name: p.Name,
                    }));
                    setProducts(formattedProducts);
                }
                
                setShowPopup(false);
                setNewProduct({ name: '', description: '', price: '', quantity: '' });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }
};

    const handleDeleteClick = async () => {
    if (!selectedProductDetails) return;
    
    const userUID = localStorage.getItem('userUID');
    
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/deleteproduct?uid=${userUID}&name=${selectedProductDetails.name}`, {
            method: 'DELETE'
        });
        
        const data = await res.json();
        
        if (data.success) {
            // Refresh products list by fetching again
            const productsRes = await fetch(`http://127.0.0.1:5000/api/products?uid=${userUID}`);
            const productsData = await productsRes.json();
            
            if (productsData.success) {
                const formattedProducts = productsData.products.map((p, index) => ({
                    id: index,
                    name: p.Name,
                }));
                setProducts(formattedProducts);
            }
            
            // Close the popup
            setProductMenu(null);
            setSelectedProductDetails(null);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    }
};

    return(
    <div>
        <div className="products-grid">
            <button className="ProductButon" onClick={handleAddClick}>Add Products</button>
            
            {products.map((product) => (
                <button key={product.id} className="product-item" onClick={() => handleProductClick(product)}>
                    <button className="burger-menu" onClick={(e) => handleMenuClick(product.id, e)}>⋮</button>
                    <h3>{product.name}</h3>
                </button>
            ))}
        </div>

        {showPopup && (
            <>
                <div className="popup-overlay"></div>
                <div className="popup">
                    <h2>Add Product</h2>
                    <input 
                        type="text" 
                        placeholder="Product Name" 
                        value={newProduct.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={newProduct.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="Price" 
                        step="0.01" 
                        min="0"
                        value={newProduct.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="Quantity" 
                        min="0"
                        value={newProduct.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                    />
                    <button onClick={handleCancelClick}>Cancel</button>
                    <button id="saveButton" onClick={handleSaveClick}>Save</button>
                </div>
            </>
        )}

        {productMenu !== null && (
            <>
                <div className="popup-overlay"></div>
                <div className="menu-dropdown">
                    <h2>{selectedProductDetails?.name}</h2>
                    <input 
                        className="inputField"
                        type="text" 
                        placeholder={selectedProductDetails?.name} />
                    <input 
                        className="inputField"
                        type="text" 
                        placeholder={selectedProductDetails?.description} />
                    <input 
                        className="inputField"
                        type="number" 
                        placeholder={selectedProductDetails ? `$${selectedProductDetails.price}` : 'Price'} />
                    <button onClick={(e) => { e.stopPropagation(); setProductMenu(null); }}>
                        Cancel
                    </button>
                    <button id="deleteButton" onClick={handleDeleteClick}>Delete Product</button>
                    <button id="saveButton">Save Changes</button>
                </div>
            </>
        )}
    </div>
    );
};

export default ProductLayout;