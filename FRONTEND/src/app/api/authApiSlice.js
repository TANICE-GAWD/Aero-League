import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: 'users/register/',
                method: 'POST',
                body: credentials
            })
        }),
        userLogin: builder.mutation({
            query: (credentials) => ({
                url: 'users/login/',
                method: 'POST',
                body: credentials
            })
        }),
        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: 'admin/login/',
                method: 'POST',
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'users/logout/',
                method: 'POST'
            })
        }),
        refresh: builder.query({
            query: () => ({
                url: 'users/refresh/',
                method: 'GET'
            })
        })
    })
})


export const { useUserLoginMutation, useAdminLoginMutation, useLogoutMutation, useRefreshQuery, useRegisterMutation } = authApiSlice