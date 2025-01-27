const express=require('express');
const {applyDoctor, removeSlotController,availableSlotController,addupdateSlotController,allAppointmentsController,allAppointmentdoctorController,allAppointmentController,getAllAppointmentsController,patientFormController,patientDetailController,allPatientController,getallPatientsController,patientController,updateAppointmentStatusController} = require('../controllers/doctorCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//Router Object
const router=express.Router();



//routes
//apply-doctor || POST
router.post('/apply-doctor', authMiddleware,applyDoctor)
// router.post('/set-default-slots', authMiddleware,defaultSlotsController)
router.delete('/remove-slot', authMiddleware,removeSlotController)
router.get('/available-slots/:id', authMiddleware,availableSlotController)
router.post('/add-update-slots', authMiddleware,addupdateSlotController)
router.get('/all-appointments/:id', authMiddleware,allAppointmentsController)
router.get('/all-appointment/:id', authMiddleware,allAppointmentController)
router.get('/all-appointment-doctor/:id', authMiddleware,allAppointmentdoctorController)
router.get('/get-all-appointments/', authMiddleware,getAllAppointmentsController)
router.post('/patient-form/:id', authMiddleware,patientFormController)
router.get('/patient-details/:id', authMiddleware,patientDetailController)
router.get('/all-patients/:id', authMiddleware,allPatientController)
router.get('/get-all-patients/', authMiddleware,getallPatientsController)
router.get('/patient/:id', authMiddleware,patientController)
router.put("/update-appointment-status/:id", authMiddleware, updateAppointmentStatusController);




module.exports=router;