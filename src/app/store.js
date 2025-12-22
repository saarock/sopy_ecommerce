import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import  productReducer  from "../features/product/productSlice";
// import Products from "../pages/products/Products";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer
    },
    });

    