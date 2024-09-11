import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import logger from "redux-logger";
import { auth } from './reducer';

const middleware = (getDefaultMiddleware: any) => {
  return getDefaultMiddleware().concat(logger);
};


export type RootState = ReturnType<typeof auth>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Create the Redux store
const store = configureStore({
  reducer: auth,
  devTools: process.env.NODE_ENV === 'development',
  middleware: middleware
});

export default store;