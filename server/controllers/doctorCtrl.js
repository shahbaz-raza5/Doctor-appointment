const path = require("path");
const multer = require("multer");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const availableSlotModel = require("../models/availableSlotModel");
const bookAppointmentModel = require("../models/bookAppointmentModel");
const patientFormModel = require("../models/patientFormModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const applyDoctorController = async (req, res) => {
  const { doctorId, isdoctorstatus } = req.body;
  try {
    let profileImagePath = "";
    if (req.file) {
      profileImagePath = `/uploads/${req.file.filename}`;
    }

    const newDoctor = new doctorModel({
      ...req.body,
      status: "pending",
      profileImage: profileImagePath, 
    });

    await newDoctor.save();

    await userModel.findByIdAndUpdate(doctorId, { isdoctorstatus });
    const adminUser = await userModel.findOne({ isAdmin: true });
    if (!adminUser) {
      return res.status(404).send({
        success: false,
        message: "Admin user not found",
      });
    }

    adminUser.notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await adminUser.save();

    res.status(201).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for doctor",
    });
  }
};


const removeSlotController = async (req, res) => {
  const { date, slotToRemove, doctorId } = req.body; // Get doctorId from the request body

  try {
    const existingSlot = await availableSlotModel.findOne({ date, doctorId });
    if (!existingSlot)
      return res.status(400).json({ msg: "No slots found for this date" });

    existingSlot.timeSlots = existingSlot.timeSlots.filter(
      (slot) => slot.slot !== slotToRemove
    );
    await existingSlot.save();

    res.json({ message: "Slot removed successfully" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

const availableSlotController = async (req, res) => {
  const { id } = req.params; 
  try {
    const availableSlots = await availableSlotModel.find({ doctorId: id });
    res.json(availableSlots);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

const addupdateSlotController = async (req, res) => {
  const { date, timeSlots, doctorId } = req.body; 
  console.log(doctorId);
  console.log(date);
  console.log(timeSlots);

  try {
    if (!date || !Array.isArray(timeSlots) || !doctorId) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: {
          date: !date ? "Date is required" : undefined,
          timeSlots: !Array.isArray(timeSlots)
            ? "timeSlots must be an array"
            : undefined,
          doctorId: !doctorId ? "doctorId is required" : undefined,
        },
      });
    }

    const existingSlot = await availableSlotModel.findOne({ date, doctorId });
    if (existingSlot) {
      existingSlot.timeSlots = timeSlots;
      await existingSlot.save();
      res.json({ message: "Slot updated successfully", slot: existingSlot });
    } else {
      const newSlot = new availableSlotModel({
        date,
        timeSlots,
        doctorId,
      });
      await newSlot.save();

      res.send({
        success: true,
        message: "Slot created successfully",
        slot: newSlot,
      });
    }
  } catch (error) {
    console.error("Error updating slots:", error); 
    res.status(500).send("Server Error");
  }
};

const allAppointmentController = async (req, res) => {
  const { id } = req.params; // Extract doctorId from params
  // Extract page, pageSize, and status from query parameters with default values
  // Calculate number of documents to skip

  try {
    // Get paginated appointments for the doctor with the specified status, sorted by date
    const appointments = await bookAppointmentModel.find({
      doctorId: id,
    });

    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ message: `No appointments found for this doctor` });
    }

    res.status(200).json({
      appointments, // The current page of appointments
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const allAppointmentdoctorController = async (req, res) => {
  const { id } = req.params; 

  try {
    const appointments = await bookAppointmentModel.find({
      doctorId: id,
    });

    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ message: `No appointments found for this doctor` });
    }

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const allAppointmentsController = async (req, res) => {
  const { id } = req.params; // Extract doctorId from params
  const { page, pageSize, status } = req.query; // Extract page, pageSize, and status from query parameters with default values
  const skip = (page - 1) * pageSize; // Calculate number of documents to skip

  try {
    // Validate status to prevent potential issues
    const validStatuses = ["upcoming", "done", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    // Get the total count of appointments for the doctor with the specified status
    const totalCount = await bookAppointmentModel.countDocuments({
      doctorId: id,
      status: status, // Filter by the status provided in the query
    });

    // Get paginated appointments for the doctor with the specified status, sorted by date
    const appointments = await bookAppointmentModel
      .find({
        doctorId: id,
        status: status, // Filter by the status provided in the query
      })
      .skip(skip)
      .limit(parseInt(pageSize))
      .sort({ date: 1 }); // You can modify sorting based on your use case

    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ message: `No ${status} appointments found for this doctor` });
    }

    res.status(200).json({
      totalCount, // Send the total count of appointments for pagination
      appointments, // The current page of appointments
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllAppointmentsController = async (req, res) => {
  // const { id } = req.params;
  const { page, pageSize, status } = req.query; // Extract page, pageSize, and status from query parameters with default values
  const skip = (page - 1) * pageSize; // Calculate number of documents to skip

  try {
    // Validate status to prevent potential issues
    const validStatuses = ["upcoming", "done", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    // Get the total count of appointments for the doctor with the specified status
    const totalCount = await bookAppointmentModel.countDocuments({
      // doctorId: id,
      status: status, // Filter by the status provided in the query
    });

    // Get paginated appointments for the doctor with the specified status, sorted by date
    const appointments = await bookAppointmentModel
      .find({
        status: status, // Filter by the status provided in the query
      })
      .skip(skip)
      .limit(parseInt(pageSize))
      .sort({ date: 1 }); // You can modify sorting based on your use case

    if (appointments.length === 0) {
      return res
        .status(404)
        .json({ message: `No ${status} appointments found for this doctor` });
    }

    res.status(200).json({
      totalCount, // Send the total count of appointments for pagination
      appointments, // The current page of appointments
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const patientDetailController = async (req, res) => {
  const { id } = req.params;

  try {
    const formdetails = await patientFormModel.find({ patientId: id }); 

    if (formdetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this doctor" });
    }

    res.status(200).json(formdetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const allPatientController = async (req, res) => {
  const { id } = req.params;

  try {
    const allPatients = await patientFormModel.find({ doctorId: id }); // Find appointments that match the doctorId

    if (allPatients.length === 0) {
      return res
        .status(404)
        .json({ message: "No Patients found for this doctor" });
    }

    res.status(200).send({
      success: true,
      data: allPatients,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getallPatientsController = async (req, res) => {
  try {
    const allPatients = await patientFormModel.find({}); 

    if (allPatients.length === 0) {
      return res.status(404).json({ message: "No Patients found " });
    }

    res.status(200).send({
      success: true,
      data: allPatients,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const patientController = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await bookAppointmentModel.find({ patientId: id }); // Find appointments that match the doctorId

    if (patient.length === 0) {
      return res
        .status(404)
        .json({ message: "No Patient found for this doctor" });
    }

    res.status(200).send({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const patientFormController = async (req, res) => {
  try {
    // Extract formData from the request body
    const formData = req.body;
    const { id } = req.params; // This should be the patientId

    // Validate the formData if needed
    if (!formData || !id) {
      return res.status(400).json({ error: "Required fields are missing" });
    }
    // Example of converting date to ISO string on the server
    const formattedDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

    // Construct the formData to match the schema structure
    const patientFormData = {
      visitDate: new Date().toISOString().split("T")[0], // Or any specific date if needed
      patientId: id,
      doctorId: formData.doctorID,
      details: {
        patientName: formData.patientName,
        patientId: formData.patientId,
        dob: formData.dateOfBirth,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        reasonForVisit: formData.reasonForVisit,
        symptoms: formData.symptoms,
        physicalExamination: formData.physicalExamination,
        diagnosis: formData.diagnosis,
        bloodPressure: formData.bloodPressure,
        heartRate: formData.heartRate,
        temperature: formData.temperature,
        respiratoryRate: formData.respiratoryRate,
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        labTests: formData.labTests,
        followUpInstructions: formData.followUpInstructions,
        nextAppointment: formData.nextAppointment,
        referral: formData.referral,
        doctorsNotes: formData.doctorsNotes,
        doctorSignature: formData.doctorSignature,
        patientAcknowledgment: formData.patientAcknowledgment,
      },
    };

    // Create a new patient record
    const patientRecord = new patientFormModel(patientFormData);
    await patientRecord.save();

    res.status(201).send({
      success: true,
      message: "Patient Record added Successfully",
    });
  } catch (error) {
    console.error("Error in patientFormController:", error);
    res.status(500).send({
      success: false,
      message: "Record not Added, Something wrong",
    });
  }
};

const updateAppointmentStatusController = async (req, res) => {
  try {
    const appointment = await bookAppointmentModel.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = req.body.status || appointment.status;
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment status updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const applyDoctor = [upload.single("profileImage"), applyDoctorController];

module.exports = {
  applyDoctor,
  removeSlotController,
  availableSlotController,
  addupdateSlotController,
  allAppointmentController,
  allAppointmentsController,
  getAllAppointmentsController,
  patientFormController,
  getallPatientsController,
  patientDetailController,
  allPatientController,
  patientController,
  updateAppointmentStatusController,
  allAppointmentdoctorController,
};
