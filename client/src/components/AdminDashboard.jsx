import React, { useEffect, useState } from 'react'
import axios from 'axios'
import OverviewCards from './AdminDashboard/OverviewCards';
import CalendarComponent from './Calendar';
const AdminDashboard = ({doctors}) => {
const [patients,setPatients]=useState([])

useEffect(()=>{
    getmyAllPatients()
},[])
 const getmyAllPatients = async () => {
    try {
      
      const res = await axios.get(`/api/v1/admin/get-all-patients`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
     
      });
   
      if (res.data.success) {
        setPatients(res.data.data|| []);
      }
    } catch (error) {   
      console.log(error);
    }
  };
 
  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    
    <OverviewCards doctors={doctors} appointments={patients}/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
     <CalendarComponent/>
    </div>
  </div>
  )
}

export default AdminDashboard