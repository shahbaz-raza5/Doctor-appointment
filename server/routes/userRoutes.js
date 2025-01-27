const express=require('express');
const { loginController, signupController, authController,availableSlotController,bookAppointmentController,patientAppointmentController,deleteAppointmentController,deleteAllNotificationController,notificationsController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//Router Object
const router=express.Router();



//routes
//LOGIN || POST
router.post('/login',loginController)

//SIGNUP || POST
router.post('/signup',signupController)
router.get('/available-slots',authMiddleware,availableSlotController)
router.post('/book-appointment/:id',authMiddleware,bookAppointmentController)
router.get('/patient-appointments/:id',authMiddleware,patientAppointmentController)
router.get('/notifications/:id',authMiddleware,notificationsController)
router.delete('/delete-appointment/:id',authMiddleware,deleteAppointmentController)
router.delete('/del-all-notifications/:id',authMiddleware,deleteAllNotificationController)

//GETUSER DATA

router.post('/getuserData',authMiddleware, authController)

module.exports=router;