import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status:false,
    userData :null
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {
        loginUser:(state,action)=> {
            state.status = true;
            state.userData = action.payload;
        },
        logoutUser:(state)=> {
          state.status = false,
          state.userData = null
        }
    }

})

export default userSlice.reducer;
export const {loginUser,logoutUser} = userSlice.actions;