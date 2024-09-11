import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser } from "./types";
import { getToken } from "../../utils/Utils";
import { setUser } from "./userSlice";

const BASE_URL = process.env.REACT_APP_SERVER_ENDPOINT;

export const getMeAPI = createApi({
    reducerPath: "getMeAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/users`,
        prepareHeaders: (headers) => {
          const accessToken = getToken();
          if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
          }
          return headers;
        }
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getMe: builder.query<IUser, null>({
            query() {
                return {
                    url: "users/me",
                    credentials: "include",
                };
            },
            transformResponse: (result: { data: { user: IUser } }) =>
                result.data.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                } catch (error) { }
            },
        }),
    }),
});
