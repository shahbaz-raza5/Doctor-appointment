import {createSlice} from '@reduxjs/toolkit'

export const alertSlice=createSlice({
    name:'alerts',
    initialState:{
        loading:false,
        comploading:false
    },
    reducers:{
        showLoading:(state)=>{
            state.loading=true
        },
        hideLoading:(state)=>{
            state.loading=false
        },
        showCompLoading:(state)=>{
            state.comploading=true
        },
        hideCompLoading:(state)=>{
            state.comploading=false
        }
    }
})

export const {showLoading,hideLoading,hideCompLoading,showCompLoading}=alertSlice.actions;

