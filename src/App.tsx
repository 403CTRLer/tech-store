import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import { database } from './database/database';

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      await database.init();
      const cartItems = database.getCartItems();
      const count = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  };

  const handleAddToCart = (productId: number, quantity: number = 1) => {
    database.addToCart(productId, quantity);
    updateCartCount();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header cartItemCount={cartItemCount} />
        <main>
          <Routes>
            <Route 
              path="/" 
              element={<HomePage onAddToCart={handleAddToCart} />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductPage onAddToCart={handleAddToCart} />} 
            />
            <Route 
              path="/cart" 
              element={<CartPage onUpdateCart={updateCartCount} />} 
            />
            <Route 
              path="/checkout" 
              element={<CheckoutPage />} 
            />
            <Route 
              path="/admin" 
              element={<AdminPage />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;