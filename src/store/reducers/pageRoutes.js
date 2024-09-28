import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageRoutes: [],
};

export const pageRoutesSlice = createSlice({
  name: "pageRoutes",
  initialState,
  reducers: {
    setPageRoutes: (state, action) => {
      state.pageRoutes = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPageRoutes } = pageRoutesSlice.actions;

export default pageRoutesSlice.reducer;
