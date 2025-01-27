const userModel = require("../models/userModel");
const availableSlotModel = require("../models/availableSlotModel");
const bookAppointmentModel = require("../models/bookAppointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signupController = async (req, res) => {

  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send({
      message: "User Signed Up Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Signup Controller ${error}`,
      success: false,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password, ispatient, isdoctor } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }

    if (
      (ispatient !== null && user.ispatient !== ispatient) ||
      (isdoctor !== null && user.isdoctor !== isdoctor)
    ) {
      return res.status(200).send({
        message: "Invalid login attempt for the given role",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .send({ message: "Login successfully", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Login Controller Error: ${error}`,
      success: false,
    });
  }
};

const availableSlotController = async (req, res) => {
  try {
    const availableSlots = await availableSlotModel
      .find({
        "timeSlots.isBooked": false,
      })
      .select("date timeSlots.slot");

    res.json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ error: "Failed to fetch available slots" });
  }
};


const bookAppointmentController = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
      doctorName,
      specialization,
      patientId,
      appointmentDate,
      timeSlot,
      reasonForVisit,
    } = req.body;

    const doctorId = req.params.id;

    // Create a new appointment
    const newAppointment = new bookAppointmentModel({
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
      doctorName,
      specialization,
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
      reasonForVisit,
    });

    // Save the appointment to the database
    await newAppointment.save();

    // Mark the time slot as booked
    await availableSlotModel.updateOne(
      {
        date: new Date(appointmentDate),
        "timeSlots.slot": timeSlot,
      },
      {
        $set: { "timeSlots.$.isBooked": true },
      }
    );

    // Notify the doctor about the new appointment
    const user = await userModel.findOne({ _id: doctorId });
    user.notification.push({
      type: "Appointment Booked",
      message: `${fullName} has booked an appointment on ${appointmentDate} at ${timeSlot}.`,
    });

    await user.save();
    // Notify the Patient about the new appointment
    const patient = await userModel.findOne({ patientId: patientId });
    patient.notification.push({
      type: "Appointment Booked",
      message: `You booked an appointment on ${appointmentDate} at ${timeSlot}.`,
    });

    await patient.save();

    res
      .status(201)
      .send({ message: "Appointment booked successfully", success: true });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res
      .status(500)
      .send({ error: "Failed to book appointment", success: false });
  }
};

const patientAppointmentController = async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await bookAppointmentModel.find({
      patientId: id,
    });

    res.status(200).send({ success: true, message: appointments });
  } catch (error) {
    console.error("Error fetching Patient Appointments:", error);
    res.status(500).json({ error: "Failed to fetch Patient Appointments" });
  }
};

const deleteAppointmentController = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await bookAppointmentModel.findByIdAndDelete(id);

    if (!appointment) {
      return res
        .status(401)
        .send({ success: false, message: "Appointment not found" });
    }

    return res
      .status(200)
      .send({ success: true, message: "Appointment deleted Successfully" });
  } catch (error) {
    console.error("Error Deleting Patient Appointments:", error);
    res.status(500).json({ error: "Failed to Delete Patient Appointments" });
  }
};

const deleteAllNotificationController = async (req, res) => {
  console.log(req);
  try {
    console.log(req.params.id);

    const userId = req.params.id; // Get user ID from URL parameter

    // Find the user and clear both notification arrays
    const user = await userModel.findByIdAndUpdate(userId, {
      $set: { notification: [], seennotification: [] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notifications",
      error,
    });
  }
};

const notificationsController = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user notifications
    const user = await userModel.findById(userId).select('notification seennotification');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      notifications: {
        unread: user.notification,
        seen: user.seennotification,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

module.exports = {
  signupController,
  loginController,
  authController,
  availableSlotController,
  bookAppointmentController,
  patientAppointmentController,
  deleteAppointmentController,
  deleteAllNotificationController,
  notificationsController
};
