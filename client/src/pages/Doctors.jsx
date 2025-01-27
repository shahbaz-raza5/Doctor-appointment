import React from "react";
import { DoctorCard, Layout } from "../components";
import { useSelector } from "react-redux";


const Doctors = () => {
  const { doctor } = useSelector((state) => state.doctor);

  return (
    <>
      <Layout>{doctor?.length > 0 && <DoctorCard doctors={doctor} />}</Layout>
    </>
  );
};

export default Doctors;
