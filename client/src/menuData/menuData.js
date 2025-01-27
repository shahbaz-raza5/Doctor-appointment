// menuData.js

import Icon1 from '../components/iconss/dashboard.svg';
import Icon2 from '../components/iconss/health.svg';
import Icon3 from '../components/iconss/appointment.svg';
import Icon4 from '../components/iconss/notification.svg';
import Icon5 from '../components/iconss/setting.svg';
import Icon6 from '../components/iconss/doctor.svg';
import Icon7 from '../components/iconss/patient.svg';
import Icon8 from '../components/iconss/doctorapply.svg';
import Icon9 from '../components/iconss/profile.svg';
import Icon10 from '../components/iconss/slots.svg';



export const menuData = [
    {
      name: "Dashboard",
      path: "/",
      icon: Icon1,  // Store the icon path, not JSX
    },
    {
      name: "Health Care",
      path: "/health",
      icon: Icon2,
    },
    {
        name: "Appointments",
        path: "/appointments",
        icon: Icon3,
      },
    {
      name: "Notification",
      path: "/notifications",
      icon: Icon4,
    },
  
    {
      name: "Profile",
      path: "/profile",
      icon: Icon9,
    },
];

export const doctorMenu=[
  {
    name: "Dashboard",
    path: "/",
    icon: Icon1,  // Store the icon path, not JSX
  },
  {
    name: "Apply Doctor",
    path: "/apply-doctor",
    icon: Icon8,  // Store the icon path, not JSX
  },
  {
    name: "Appointments",
    path: "/all-appointments",
    icon: Icon3,  // Store the icon path, not JSX
  },
  {
    name: "Mange Slots",
    path: "/manage-slots",
    icon: Icon10,  // Store the icon path, not JSX
  },
  {
    name: "Patients",
    path: "/patients",
    icon: Icon7,  // Store the icon path, not JSX
  },
  {
    name: "Notification",
    path: "/notifications",
    icon: Icon4,
  },
  {
    name: "Profile",
    path: "/doctor/profile",
    icon: Icon9,  // Store the icon path, not JSX
  },

]

export const adminMenu = [
  {
    name: "Dashboard",
    path: "/",
    icon: Icon1,  // Store the icon path, not JSX
  },
  {
    name: "Patient",
    path: "/patients",
    icon: Icon7,
  },
  {
      name: "Doctors",
      path: "/all-doctors",
      icon: Icon6,
    },
    {
      name: "Doctor Applications",
      path: "/admin/doctor-applications",
      icon: Icon3,
    },
  {
    name: "Notification",
    path: "/notifications",
    icon: Icon4,
  },
 
];