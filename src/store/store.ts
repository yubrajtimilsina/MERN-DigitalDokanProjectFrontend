import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice"
import checkoutSlice from "./checkoutSlice"
import adminCategorySlice from "./adminCategorySlice";
import adminUserSlice from "./adminUserSlice"

import createSlice from "./cartSlice"
const store =configureStore({
    reducer :{
        auth : authSlice,
        products : productSlice,
        cart : createSlice,
        orders : checkoutSlice,
        categories : adminCategorySlice,
        users : adminUserSlice
    }
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
