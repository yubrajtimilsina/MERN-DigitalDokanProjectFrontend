import { createSlice,PayloadAction } from "@reduxjs/toolkit";

import { User } from "./types";

const userInfo :User = {
    name : "yubraj timilsina",
    age : 22
}

const userSlice =createSlice({
    name : "user",
    initialState : userInfo,
    reducers : {
        setName(state:User,action:PayloadAction<User>){
            state.name = "hahahehe"
        },
        setAge(state:User,action:PayloadAction<User>){
            state.age =12
        }
    }
})

//Action 
export const {setName,setAge} = userSlice.actions

export default userSlice.reducer