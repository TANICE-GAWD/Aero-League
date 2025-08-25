import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, removeCredentials } from '../../features/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://tal-backend.vercel.app/',
    credentials: 'include',
    prepareHeaders: (Headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
});

const baseQueryWithCredentials = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    
    if (result.error && result.error.status === 401 && result.error.data?.code === 'token_not_valid') {
        console.warn('Access token expired. Attempting to refresh.');
        
        api.dispatch(removeCredentials());

        const refreshResult = await baseQuery(
            {
                url: 'users/refresh/',
                method: 'POST',
            },
            api,
            extraOptions
        );


        if (refreshResult.data) {
            console.info('Token refreshed successfully.');
            api.dispatch(setCredentials({token: refreshResult.data.access_token, user: refreshResult.data.user}));

            result = await baseQuery(args, api, extraOptions);
        } else {
            console.error('Token refresh failed. Logging out.');
            console.log(refreshResult.error);
            api.dispatch(removeCredentials());
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithCredentials,
    endpoints: (builder) => ({}),
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false, 
    refetchOnReconnect: false  
});
