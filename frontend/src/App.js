import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import ExpiryAlerts from './pages/ExpiryAlerts';
import NewServices from './pages/NewServices';
import CustomInvoice from './pages/CustomInvoice';
import Bin from './pages/Bin';
import CurrentMonthCustomers from './pages/CurrentMonthCustomers';
import ServiceSoon from './pages/ServiceSoon';
import ServiceDelay from './pages/ServiceDelay';
import Complaints from './pages/Complaints';
import AddComplaint from './pages/AddComplaint';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick theme="colored" />
      <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/admin" /> : <Register />} />
        <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/admin" /> : <ForgotPassword />} />
        <Route path="/reset-password" element={isLoggedIn ? <Navigate to="/admin" /> : <ResetPassword />} />
        <Route path="/admin/*" element={
          isLoggedIn ? (
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/add-customer" element={<AddCustomer />} />
                <Route path="/current-month-customers" element={<CurrentMonthCustomers />} />
                <Route path="/expiry-alerts" element={<ExpiryAlerts />} />
                <Route path="/service-soon" element={<ServiceSoon />} />
                <Route path="/service-delay" element={<ServiceDelay />} />
                <Route path="/new-services" element={<NewServices />} />
                <Route path="/custom-invoice" element={<CustomInvoice />} />
                <Route path="/bin" element={<Bin />} />
                <Route path="/complaints" element={<Complaints />} />
                <Route path="/add-complaint" element={<AddComplaint />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
