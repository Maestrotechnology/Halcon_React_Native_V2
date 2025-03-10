import {configureStore} from '@reduxjs/toolkit';
import RootReducer from '../Reducer/RootReducer';

const store = configureStore({
  reducer: RootReducer,
});

export default store;
