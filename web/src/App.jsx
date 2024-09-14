import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateToken } from '../src/redux/user/userSlice.js';
import Contact from './pages/Contact';
import Payment from './pages/Payment';
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(updateToken(token));
    }
  }, [dispatch]);

  return (
     // Pass the store prop to Provider
     <Provider store={store}>
     {/* Pass the persistor prop to PersistGate */}
     <PersistGate loading={null} persistor={persistor}>
       <BrowserRouter>
         <Header />
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/about" element={<About />} />
           <Route path="/signin" element={<SignIn />} />
           <Route path="/signup" element={<SignUp />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/payment" element={<Payment />} />
           {/* Protect the dashboard and profile routes with PrivateRoute */}
           <Route path="/dashboard" element={
             <PrivateRoute>
               <Dashboard />
             </PrivateRoute>
           } />
           <Route path="/profile" element={
             <PrivateRoute>
               <Profile />
             </PrivateRoute>
           } />
         </Routes>
       </BrowserRouter>
     </PersistGate>
   </Provider>
  );
}
