import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "../../components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { message } from "antd";

const DoctorManageSlots = () => {
  const { user } = useSelector((state) => state.user);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([
    { slot: "09:00 AM" },
    { slot: "01:00 PM" },
    { slot: "04:00 PM" },
  ]); // Default slots
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [lastGeneratedDate, setLastGeneratedDate] = useState(null); // Persist last generated date
  const doctorId = user?._id;

  const fetchSlots = async () => {
    try {
      const response = await axios.get(
        `/api/v1/doctor/available-slots/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Sort by date before setting the state
      const sortedSlots = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setAvailableSlots(sortedSlots);
      console.log("Fetched and sorted slots:", sortedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const addSlot = async (date, slots) => {
    console.log(`Adding slots for date: ${date}`, slots);

    try {
      const response = await axios.post(
        "/api/v1/doctor/add-update-slots",
        {
          doctorId, // Include doctorId in the request body
          date,
          timeSlots: slots,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Add Slot Response:", response.data);
      fetchSlots(); // Fetch slots again after adding a new one
    } catch (error) {
      console.error("Error adding slot:", error);
    }
  };

  const deleteSlot = async (date, slotToRemove) => {
    try {
      await axios.delete("/api/v1/doctor/remove-slot", {
        data: {
          doctorId,
          date,
          slotToRemove,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchSlots(); // Update view after deletion
    } catch (error) {
      console.error(
        "Error deleting slot:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const generateNextSevenDaysSlots = async () => {
    let startDate;

    if (!lastGeneratedDate) {
      startDate = new Date();
    } else {
      startDate = new Date(lastGeneratedDate);
      startDate.setDate(startDate.getDate() + 1);
    }

    const nextSevenDays = new Date(startDate);
    nextSevenDays.setDate(startDate.getDate() + 6);

    const datesToProcess = [];
    const slotPromises = [];

    for (
      let d = new Date(startDate);
      d <= nextSevenDays;
      d.setDate(d.getDate() + 1)
    ) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        const formattedDate = d.toISOString().split("T")[0];
        datesToProcess.push(formattedDate);

        const slotsForDate = timeSlots.map((slot) => ({ slot: slot.slot }));
        slotPromises.push(addSlot(formattedDate, slotsForDate));
      }
    }

    try {
      await Promise.all(slotPromises);
      setHighlightedDates(datesToProcess);
      setLastGeneratedDate(nextSevenDays); // Update lastGeneratedDate after processing
      message.success("Next Week Slots Added Successfully");
    } catch (error) {
      console.error("Error generating slots:", error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      if (highlightedDates.includes(formattedDate)) {
        return "highlight"; // Add a CSS class to highlight the date
      }
    }
    return null;
  };

  return (
    <Layout>
      <div className="p-8 mx-auto">
        <h2 className="text-2xl font-bold mb-4">Manage Available Slots</h2>
        <div className="">
          <div className=" items-center flex justify-center">
            <Calendar tileClassName={tileClassName} />
          </div>
          <div className="flex flex-col">
            <div>
              <button
                onClick={generateNextSevenDaysSlots}
                className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Generate Slots for Next 7 Days
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3  w-max">
              {availableSlots.map((slot) => (
                <div
                  key={slot.date}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {new Date(slot.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </h3>
                  <ul className="space-y-1">
                    {slot.timeSlots.map((ts) => (
                      <li
                        key={ts.slot}
                        className={`flex items-center justify-between p-2 rounded-md ${
                          ts.isBooked ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        <span>{ts.slot}</span>
                        <button
                          onClick={() => deleteSlot(slot.date, ts.slot)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorManageSlots;
