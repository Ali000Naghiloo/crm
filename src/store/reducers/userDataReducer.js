import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  location: null,
  userRole: "",
  userAccess: [],
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setUserLocation: (state, action) => {
      state.location = action.payload;
    },
    setUserAcess: (state, action) => {
      state.userAccess = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, setUserRole, setUserLocation, setUserAcess } =
  userDataSlice.actions;

export default userDataSlice.reducer;
