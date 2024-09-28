import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allEnum: null,
};

export const allEnumSlice = createSlice({
  name: "allEnum",
  initialState,
  reducers: {
    setAllEnum: (state, action) => {
      state.allEnum = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAllEnum } = allEnumSlice.actions;

export default allEnumSlice.reducer;
