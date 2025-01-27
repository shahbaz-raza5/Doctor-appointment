import {createSlice} from '@reduxjs/toolkit'

export const notificationSlice=createSlice({
    name:'notification',
    initialState:{
        notification:[],
        
    },
    reducers:{
        setnotification:(state,action)=>{
            state.notification=action.payload
        },
    }
})

export const {setnotification}=notificationSlice.actions;

