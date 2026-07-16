import {createSlice } from '@reduxjs/toolkit'




const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {

            return action.payload

        },
        deleteNotification(state, action) {
           
            return ''
            
            
        }
    }
        


})

export const { setNotification, deleteNotification } = notificationSlice.actions

export default notificationSlice.reducer