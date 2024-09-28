import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: true,
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    setSideMenuIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSideMenuIsOpen } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
