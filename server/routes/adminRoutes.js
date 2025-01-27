const express = require("express");
const {
  getAllDoctorsController,getAllPatientsController,handleDoctorStatus,getDoctorByIdController
} = require("../controllers/adminCtrl");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();



//GET METHOD 
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);
router.get("/get-all-patients", authMiddleware, getAllPatientsController);
router.post("/handleDoctorStatus", authMiddleware, handleDoctorStatus);

router.get("/getDoctorById/:id", authMiddleware, getDoctorByIdController);



module.exports = router;
