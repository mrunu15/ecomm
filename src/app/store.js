import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../feature/products/productSlice'
import userReducer from '../feature/user/userSlice';
import cartReducer from '../feature/cart/cartSlice';
import orderReducer from '../feature/order/orderSlice';
import adminReducer from '../feature/admin/adminSlice';

export const store=configureStore({
reducer:{
    product:productReducer,
    user:userReducer,
    cart:cartReducer,
    order:orderReducer,
    admin:adminReducer
}
})