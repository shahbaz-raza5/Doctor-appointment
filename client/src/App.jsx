import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Header,
  Footer,
  Home,
  HealthCare,
  Spinner,
  DoctorApplications,
  ApplyDoctor,
  Appointments,
  AllAppointments,
  ProtectedRoute,
  PublicRoute,
  HeroSection,
  Login,
  Signup,
  DoctorDetails,
  BookAppointment,
  DoctorManageSlots,
  Notifications,
  PatientRecordForm,
  PatientDetails,
  Patients,
  Doctors,
} from "./components";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <>
      <Router>
        <Header />
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patient-form/:id/:index"
              element={
                <ProtectedRoute>
                  <PatientRecordForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patient-form/:id"
              element={
                <ProtectedRoute>
                  <PatientRecordForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <HealthCare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply-doctor"
              element={
                <ProtectedRoute>
                  <ApplyDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-slots"
              element={
                <ProtectedRoute>
                  <DoctorManageSlots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-appointments"
              element={
                <ProtectedRoute>
                  <AllAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/book-appointment/:id"
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctor-applications"
              element={
                <ProtectedRoute>
                  <DoctorApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patient-details/:id"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/patient-details/:id"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctor-details/:paramid"
              element={
                <ProtectedRoute>
                  <DoctorDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile"
              element={
                <ProtectedRoute>
                  <DoctorDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <PublicRoute>
                  <HeroSection />
                </PublicRoute>
              }
            />
            <Route
              path="/doctor-login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/login/:loginType"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup/:signupType"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
          </Routes>
        )}
        <Footer />
      </Router>
    </>
  );
}

export default App;
