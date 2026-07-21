import {createSlice } from '@reduxjs/toolkit'




const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        showNotification(state, action) {

            return action.payload

        },
        deleteNotification(state, action) {
           
            return ''
            
            
        }
    }
        


})


const {showNotification,deleteNotification}= notificationSlice.actions

export const setNotification=(text, time)=>{
    return dispatch=>{

        dispatch(showNotification(text))

        setTimeout(()=>{
            dispatch(deleteNotification())
        }, time * 1000)
    }

}



export default notificationSlice.reducer