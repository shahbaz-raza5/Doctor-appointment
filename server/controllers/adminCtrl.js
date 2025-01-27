const doctorModel=require('../models/doctorModel');
const patientFormModel = require('../models/patientFormModel');
const userModel=require('../models/userModel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const getAllDoctorsController = async (req, res) => {
    try {
      console.log(req.body);
      const doctors = await doctorModel.find({});
      res.status(200).send({
        success: true,
        message: "Doctors Data list",
        data: doctors,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while getting doctors data",
        error,
      });
    }
  };

  const handleDoctorStatus=async(req,res)=>{
    try {
      const {doctorId,status}=req.body;
      const doctor=await doctorModel.findByIdAndUpdate(doctorId,{status})
      const user=await userModel.findOne({_id:doctor.userId})
      const notification=user.notification;
      notification.push({
        type:'Doctor Request Updated',
        message:`Your Doctor Application has been ${status} `,
        onClickPath: "/notification",
      })
      user.isdoctor = status === "Approved" ? true : false;
      user.isdoctorstatus ="Approved";
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  }

  const getDoctorByIdController = async (req, res) => {
    try {
      console.log('params',req.params);
      const doctorId = req.params.id;
 
  
      // Find doctor by ID
      const doctor = await doctorModel.findOne({ userId:doctorId })
  
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }
  
      // Return doctor details
      res.status(200).json({
        success: true,
        doctor,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }; 

  const getAllPatientsController =async (req,res)=>{
    try {
      console.log(req.body);
      const patients = await patientFormModel.find({});
      res.status(200).send({
        success: true,
        message: "Patients Data list",
        data: patients,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while getting patients data",
        error,
      });
    }
  }
  module.exports={getAllDoctorsController,handleDoctorStatus,getDoctorByIdController,getAllPatientsController}
