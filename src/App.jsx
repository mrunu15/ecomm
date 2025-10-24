import React, { useEffect } from 'react';
import Home from './pages/Home';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';

import Products from './pages/Products';
import Register from './User/Register';
import Login from './User/Login';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './feature/user/userSlice';
import UserDashboard from './User/UserDashboard';
import Profile from './User/profile';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateProfile from './User/UpdateProfile';
import UpdatePassword from './User/UpdatePassword';
import ForgotPassword from './User/ForgotPassword';
import ResetPassword from './User/ResetPassword';
import ScrollToTop from './pages/ScrollToTop';
import Cart from './Cart/Cart';
import Shipping from './Cart/Shipping';
import OrderConfirm from './Cart/OrderConfirm';
import Payment from './Cart/Payment';
import PaymentSuccess from './Cart/PaymentSuccess';
import MyOrders from './Orders/MyOrders';
import OrderDetails from './Orders/OrderDetails';
import Dashboard from './Admin/Dashboard';
import ProductsList from './Admin/ProductsList';
import CreateProduct from './Admin/CreateProduct';
import UpdateProduct from './Admin/UpdateProduct';
import UsersList from './Admin/UsersList';
import UpdateRole from './Admin/UpdateRole';
import OrdersList from './Admin/OrdersList';
import UpdateOrder from './Admin/UpdateOrder';
import ReviewsList from './Admin/ReviewsList';
import About from './pages/About';
import Contact from './pages/Contact';
import Return from './return/Return';
import ChatApp from './Admin/ChatApp';
import ProductReviews from "./Admin/ProductReviews";

function App() {
  const {isAuthenticated,user}=useSelector(state=>state.user);
  const dispatch=useDispatch()
  useEffect(()=>{
    if(isAuthenticated){
      dispatch(loadUser())
    }
  },[dispatch])
  
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/product/:id" element={<ProductDetails />}/>
       <Route path="/register" element={<Register/>}/>
       <Route path="/login" element={<Login/>}/>
      
       <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
       <Route path="/return/:orderId" element={<Return />} />
      <Route path="/products" element={<Products/>}/>
      <Route path="/products/:keyword" element={<Products/>}/>
       
      <Route path="/profile" element={<ProtectedRoute element={<Profile/>}/>}/>
      <Route path="/password/forgot" element={<ForgotPassword/>}/>
      <Route path="/reset/:token" element={<ResetPassword/>}/>
      <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile/>}/>}/>
      <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword/>}/>}/>
      <Route path="/cart" element={<Cart/>}/>
       <Route path="/shipping" element={<ProtectedRoute element={<Shipping/>}/>}/>
      <Route path="/order/confirm" element={<ProtectedRoute element={<OrderConfirm/>}/>}/>
      <Route path="/process/payment" element={<ProtectedRoute element={<Payment/>}/>}/>
      <Route path="/paymentSuccess" element={<ProtectedRoute element={<PaymentSuccess/>}/>}/>
      <Route path="/orders/user" element={<ProtectedRoute element={<MyOrders/>}/>}/>
      <Route path="/order/:orderId" element={<ProtectedRoute element={<OrderDetails/>}/>}/>
      {/* Admin Routes */}
       <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard/>} adminOnly={true}/>}/>
       <Route path="/admin/chat" element={<ProtectedRoute element={<ChatApp/>} adminOnly={true}/>}/>
      <Route path="/admin/products" element={<ProtectedRoute element={<ProductsList/>} adminOnly={true}/>}/>
     <Route path="/admin/product/create" element={<ProtectedRoute element={<CreateProduct/>} adminOnly={true}/>}/>
      <Route path="/admin/product/:updateId" element={<ProtectedRoute element={<UpdateProduct/>} adminOnly={true}/>}/>
      <Route path="/admin/users" element={<ProtectedRoute element={<UsersList/>} adminOnly={true}/>}/>
      <Route path="/admin/user/:userId" element={<ProtectedRoute element={<UpdateRole/>} adminOnly={true}/>}/>
      <Route path="/admin/orders" element={<ProtectedRoute element={<OrdersList/>} adminOnly={true}/>}/>
      <Route path="/admin/order/:orderId" element={<ProtectedRoute element={<UpdateOrder/>} adminOnly={true}/>}/>
      <Route path="/admin/reviews" element={<ProtectedRoute element={<ReviewsList/>} adminOnly={true}/>}/>
      <Route path="/admin/reviews/:productId" element={<ProductReviews />} />
    </Routes>
    {isAuthenticated && <UserDashboard user={user}/>}
    <ScrollToTop />
   </Router>
   
  )
}

export default App
