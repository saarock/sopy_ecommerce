import { createSlice } from "@reduxjs/toolkit";


const initialState = [

]

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newProduct = {
                userId: action.payload.userId,
                productId: action.payload.productId,
                totalItem: parseInt(action.payload.totalItem),
                totalPrice: parseInt(action.payload.totalPrice),
                imageUrl: action.payload.imageUrl,
                productName: action.payload.productName
            };

            const existingProduct = state.find(
                product => product.productId === newProduct.productId
            );

            if (existingProduct) {
                existingProduct.totalItem += parseInt(newProduct.totalItem);
                existingProduct.totalPrice +=parseInt( newProduct.totalPrice);
            } else {
                state.unshift(newProduct); // Add only if it doesn't already exist
            }
        }
        ,

        deleteFromCart: (state, action) => {
            return state.filter(currentProduct => currentProduct.productId !== action.payload.productId);
        },
        
        deleteAllFromCart: (state, action) => {
            state.length = 0;
        }
    }
});


export const { addToCart, deleteFromCart, deleteAllFromCart } = productSlice.actions;

export default productSlice.reducer;
