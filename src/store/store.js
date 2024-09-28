import { configureStore } from "@reduxjs/toolkit";
import userData from "./reducers/userDataReducer";
import sideMenu from "./reducers/sideMenu";
import pageRoutes from "./reducers/pageRoutes";
import allEnum from "./reducers/enumReducer";

export const store = configureStore({
  reducer: { userData, sideMenu, pageRoutes, allEnum },
});
