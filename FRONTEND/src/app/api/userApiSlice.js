import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/users/details/',
      method: 'GET',
    }),
    getNotifications: builder.query({
      query: () => '/users/notifications/',
      method: 'GET',
    }),
    updateVideoLink: builder.mutation({
        query: (link) => ({
            url: '/users/add-video/',
            method: 'POST',
            body: { 'video_link': link },
        }),
    }),
    requestOTP: builder.mutation({
        query: (email) => ({
            url: '/users/otp/generate/',
            method: 'POST',
            body: email,
        }),
    }),
    verifyOTP: builder.mutation({
        query: ({ email, otp }) => ({
            url: '/users/verify/email/',
            method: 'POST',
            body: { email, otp_code: otp },
        }),
    }),
    validateOTP: builder.mutation({
        query: ({ email, otp }) => ({
            url: '/users/validate/otp/',
            method: 'POST',
            body: { email, otp_code: otp },
        }),
    }),
    resetPassword: builder.mutation({
        query: ({ email, otp, password }) => ({
            url: '/users/reset/password/',
            method: 'POST',
            body: { email, new_password: password },
        }),
    }),
    getTeams: builder.query({
        query: () => '/admin/teams/',
        method: 'GET',
    }),
    updateTeam: builder.mutation({
        query: ({id, team}) => ({
            url: `/admin/teams/${id}/`,
            method: 'PATCH',
            body: team,
        }),
    }),
    deleteTeam: builder.mutation({
        query: (id) => ({
            url: `/admin/teams/${id}/`,
            method: 'DELETE',
        }),
    }),
    getAdminNotifications: builder.query({
      query: () => '/admin/notifications/',
      method: 'GET',
    }),
    createNotification: builder.mutation({
      query: (notification) => ({
        url: '/admin/notifications/',
        method: 'POST',
        body: notification,
      }),
    }),
    updateNotification: builder.mutation({
      query: ({ id, notification }) => ({
        url: `/admin/notifications/${id}/`,
        method: 'PATCH',
        body: notification,
      }),
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}/`,
        method: 'DELETE',
      }),
    }),
    freezeVideo: builder.mutation({
      query: () => ({
        url: `/users/freeze-video/`,
        method: 'POST',
      }),
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: `/users/details/`,
        method: 'PATCH',
        body: userData,
      }),
    }),
  }),
});

export const { useGetUserQuery, useGetNotificationsQuery, useUpdateVideoLinkMutation, useRequestOTPMutation, useVerifyOTPMutation, useGetTeamsQuery, useUpdateTeamMutation, useDeleteTeamMutation, useGetAdminNotificationsQuery, useCreateNotificationMutation, useUpdateNotificationMutation, useDeleteNotificationMutation, useValidateOTPMutation, useResetPasswordMutation, useFreezeVideoMutation, useUpdateUserMutation } = userApiSlice;
