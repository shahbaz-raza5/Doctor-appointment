import React from 'react'
import PatientDetails from './PatientDetails'
import { useSelector } from 'react-redux'
const HealthCare = () => {
  const {user}=useSelector((state)=>state.user)
  return (
    <PatientDetails id={user?.patientId}/>
  )
}

export default HealthCare