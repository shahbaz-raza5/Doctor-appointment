import React, { useState } from "react";
import { Layout } from "../components";
import { useSelector } from "react-redux";
import { Pagination } from "antd";
import axios from "axios";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("unread");
  const { user } = useSelector((state) => state.user);
  const { notification } = useSelector((state) => state.notification);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); 
  const [unreadNotifications, setUnreadNotifications] = useState(notification);
  const [readNotifications, setReadNotifications] = useState(
    user?.seennotification || []
  );


  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginateNotifications = (notifications) => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return notifications.slice(start, end);
  };

  const renderNotifications = (notifications) => {
    const paginatedNotifications = paginateNotifications(notifications);

    return notifications && notifications.length > 0 ? (
      <div className="border-b-2 border-gray-800">
        <div className="bg-gray-100 text-neutral-800">
          {paginatedNotifications.map((notification, index) => (
            <div
              key={index}
              onClick={() => markAsRead(notification, index)}
              className="whitespace-nowrap px-6 py-4 border-b border-gray-200 text-base cursor-pointer hover:bg-gray-200"
            >
              {notification?.message}
            </div>
          ))}
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={notifications?.length}
          onChange={handlePageChange}
          className="mt-4 text-center"
        />
      </div>
    ) : (
      <p>No notifications available.</p>
    );
  };

  const markAsRead = async (notification, index) => {
    try {
      await axios.post(
        `/api/v1/user/mark-notification-read/${user?._id}`,
        { notification },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUnreadNotifications((prev) =>
        prev.filter((_, i) => i !== index)
      );
      setReadNotifications((prev) => [notification, ...prev]);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const delNotifications = async () => {
    try {
      await axios.delete(
        `/api/v1/user/del-all-notifications/${user?._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUnreadNotifications([]);
      setReadNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabChange = (tab) => {
    event.preventDefault();
    setActiveTab(tab);
   
  };

  return (
    <Layout>
      <ul
        className="mb-5 flex list-none flex-row flex-wrap border-b-0 ps-0 p-2"
        role="tablist"
      >
        <li role="presentation">
          <a
            href="#unread"
            className={`my-2 block border-x-0 border-b-2 border-t-0 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight hover:bg-zinc-100 focus:outline-none ${
              activeTab === "unread"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500"
            }`}
            role="tab"
            aria-controls="unread"
            aria-selected={activeTab === "unread"}
            onClick={() => handleTabChange("unread")}
          >
            Unread Notifications
          </a>
        </li>
        <li role="presentation" className="relative z-20">
          <a
            href="#read"
            className={`relative my-2 block border-x-0 border-b-2 border-t-0 px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight hover:bg-zinc-100 focus:outline-none ${
              activeTab === "read"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500"
            }`}
            role="tab"
            aria-controls="read"
            aria-selected={activeTab === "read"}
            onClick={() => handleTabChange("read")}
          >
            Read Notifications
          </a>
        </li>

        <button
          className=" bg-red-400 text-white px-4 py-2 rounded"
          onClick={delNotifications}
        >
          Delete Notifications
        </button>
      </ul>
      <div className="mb-6">
        <div
          className={`transition-opacity duration-150 ease-linear ${
            activeTab === "unread" ? "block opacity-100" : "hidden opacity-0"
          }`}
          id="unread"
          role="tabpanel"
          aria-labelledby="unread-tab"
        >
          {renderNotifications(unreadNotifications)}
        </div>
        <div
          className={`transition-opacity duration-150 ease-linear ${
            activeTab === "read" ? "block opacity-100" : "hidden opacity-0"
          }`}
          id="read"
          role="tabpanel"
          aria-labelledby="read-tab"
        >
          {renderNotifications(readNotifications)}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
