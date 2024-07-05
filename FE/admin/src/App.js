import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListCategories from './components/Category';
import ListCourts from './components/Court';
import SideBar from './components/Sidebar';
import NewCategory from './components/Add/Category';
import EditCategory from './components/Edit/Category';
import DeleteCategory from './components/Delete/Category';
import ListOrders from './components/Order';
import ListOrderDetails from './components/OrderDetails';
import NewCourt from './components/Add/Court';
import DeleteCourt from './components/Delete/Court';
import AuthProvider, { AuthContext } from './contexts/authContext';
import Login from './components/Login';
import ProtectedRoute from './services/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('AT');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
    <div>
      <AuthProvider>
        <Header/>
        <BrowserRouter>
          <Routes>
            <Route path='/AdminLogin' element={<Login/>} />
          </Routes>
          
          {isAuthenticated && 
          <SideBar>
            <Routes>
              {/* <Route path='/login' element={<Login/>} /> */}
              <Route path='/Category' element={<ListCategories />} />
              <Route path='/Courts' element={<ListCourts />} />
              <Route path='Order' element={<ListOrders/>} />
              <Route path='OrderDetail' element={<ListOrderDetails/>} />
              <Route path='/Add/Category' element={<NewCategory />} />
              <Route path='/Add/Court' element={<NewCourt/>} />
              <Route path='/Delete/Category/:Id' element={<DeleteCategory />} />
              <Route path='Delete/Court/:Id' element={<DeleteCourt/>} />
            </Routes>
          </SideBar>}
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
