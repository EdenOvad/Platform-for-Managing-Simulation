import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserData, setToken, removeToken } from '../../utils/Utils';

interface UserState {
  user: any | null;
}

const initialState: UserState = {
  user: getUserData() ? JSON.parse(getUserData()) : null
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      removeToken(); // Clear token on logout
    },
    setUser: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload;
      if (action.payload && action.payload.token) {
        setToken(action.payload.token); // Save token
      } else {
        removeToken(); // Clear token if payload is null
      }
    }
  }
});

export default userSlice.reducer;

export const { logout, setUser } = userSlice.actions;
