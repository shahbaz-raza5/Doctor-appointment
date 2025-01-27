import {configureStore} from "@reduxjs/toolkit"
import { alertSlice } from '../slice/alertSlice'
import {userSlice} from "../slice/userSlice"
import { doctorSlice } from "../slice/doctorSlice";
import { notificationSlice } from "../slice/notificationSlice";


export default configureStore({
    reducer:{
        alerts:alertSlice.reducer,
        user:userSlice.reducer,
        doctor:doctorSlice.reducer,
        notification:notificationSlice.reducer,
    },
});