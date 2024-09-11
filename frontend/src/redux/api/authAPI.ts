import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GenericResponse, LoginUserRequest, RegisterUserRequest } from './types';
import { getMeAPI } from './getMeAPI';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user_id: string;
}

const BASE_URL: string = process.env.REACT_APP_SERVER_ENDPOINT || '';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<GenericResponse, RegisterUserRequest>({
      query(data) {
        return {
          url: 'register',
          method: 'POST',
          body: data,
        };
      },
    }),
    loginUser: builder.mutation<{ access_token: string; status: string }, LoginUserRequest>({
      query(data) {
        return {
          url: 'login',
          method: 'POST',
          body: data,
          credentials: 'include',
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const decodedToken: DecodedToken = jwtDecode(String(data))
          const uid: string = decodedToken.user_id
          console.log(decodedToken)
          // await dispatch(getMeAPI.endpoints.getMe.initiate(null));
        } catch (error) {
          // Handle error
        }
      },
    }),
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: 'auth/logout',
          credentials: 'include',
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = authAPI;
