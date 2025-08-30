import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        removeCredentials: (state) => {
            state.user = null
            state.token = null
        },
        removeToken: (state) => {
            state.token = null
        },
        updateVideoLinkInSlice: (state, action) => {
            state.user.video_link.push({url: action.payload.video_link, added_at: new Date().toISOString()})
        },
        setUser: (state, action) => {
            state.user = action.payload.user
        },
        verifyUserEmail: (state, action) => {
            state.user.email_verified = true
        },
        freezeFinalVideo: (state) => {
            state.user.video_freeze = true
        }
    }
})

export const {setCredentials, removeCredentials, removeToken, updateVideoLinkInSlice, setUser, verifyUserEmail, freezeFinalVideo} = authSlice.actions

export default authSlice.reducer

export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token