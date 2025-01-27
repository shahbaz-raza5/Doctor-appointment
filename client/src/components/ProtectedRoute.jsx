import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../features/slice/alertSlice";
import { setUser } from "../features/slice/userSlice";
import { setnotification } from "../features/slice/notificationSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    unread: [],
    seen: [],
  });

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/getUserData",
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
      }
    } catch (error) {
      localStorage.clear();
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user?.notification) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `/api/v1/user/notifications/${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token from localStorage
          },
        }
      );
      setNotifications(response.data.notifications);
      dispatch(setnotification(response.data.notifications.unread));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}
