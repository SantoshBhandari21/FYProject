import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { notificationsAPI } from "../services/api";

const BellContainer = styled.div`
  position: relative;
`;

const BellIcon = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$isNav ? "#64748b" : "inherit")};
  font-size: ${(props) => (props.$isNav ? "15px" : "24px")};
  padding: ${(props) => (props.$isNav ? "8px 14px" : "0")};
  border-radius: ${(props) => (props.$isNav ? "6px" : "0")};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$isNav ? "6px" : "0")};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${(props) => (props.$isNav ? "500" : "normal")};

  ${(props) =>
    props.$isNav &&
    `
    &:hover {
      color: #2563eb;
      background-color: #f8fafc;
    }
  `}
`;

const Badge = styled.span`
  position: absolute;
  top: ${(props) => (props.$isNav ? "-4px" : "0")};
  right: ${(props) => (props.$isNav ? "2px" : "0")};
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: ${(props) => (props.$isNav ? "16px" : "20px")};
  height: ${(props) => (props.$isNav ? "16px" : "20px")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$isNav ? "10px" : "12px")};
  font-weight: bold;
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-left: 12px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};

  @media (max-width: 960px) {
    position: fixed;
    top: 50%;
    right: 20px;
    left: auto;
    margin-left: 0;
    width: 320px;
    transform: translateY(-50%);
  }

  @media (max-width: 480px) {
    width: 300px;
    right: 10px;
  }
`;

const NotificationHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.$isUnread ? "#eff6ff" : "white")};

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const NotificationMessage = styled.div`
  flex: 1;
  margin-right: 8px;
`;

const NotificationItemTitle = styled.p`
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
`;

const NotificationItemText = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
`;

const NotificationItemTime = styled.p`
  margin: 4px 0 0 0;
  color: #9ca3af;
  font-size: 12px;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #ef4444;
  }
`;

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
`;

const MarkAllReadBtn = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #1d4ed8;
  }
`;

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const NotificationBell = ({ isNav = false, isOpen, setIsOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [localOpen, setLocalOpen] = useState(false);
  const containerRef = useRef(null);

  const open = isNav ? localOpen : isOpen;
  const setOpen = isNav ? setLocalOpen : setIsOpen;

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle clicking outside the notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, setOpen]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.deleteNotification(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <BellContainer ref={containerRef}>
      <BellIcon
        $isNav={isNav}
        onClick={() => setOpen(!open)}
        title="Notifications"
      >
        <i className="fa-regular fa-bell"></i>
        {unreadCount > 0 && (
          <Badge $isNav={isNav}>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
        )}
        {isNav && <span>Notifications</span>}
      </BellIcon>

      <NotificationDropdown $isOpen={open}>
        <NotificationHeader>
          <NotificationTitle>Notifications</NotificationTitle>
          {unreadCount > 0 && (
            <MarkAllReadBtn onClick={handleMarkAllAsRead}>
              Mark all as read
            </MarkAllReadBtn>
          )}
        </NotificationHeader>

        {notifications.length === 0 ? (
          <EmptyState>No notifications yet</EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              $isUnread={!notification.is_read}
              onClick={() =>
                handleMarkAsRead(notification.id, new Event("click"))
              }
            >
              <NotificationContent>
                <NotificationMessage>
                  <NotificationItemTitle>
                    {notification.title}
                  </NotificationItemTitle>
                  <NotificationItemText>
                    {notification.message}
                  </NotificationItemText>
                  <NotificationItemTime>
                    {formatTime(notification.created_at)}
                  </NotificationItemTime>
                </NotificationMessage>
                <DeleteBtn
                  onClick={(e) => handleDelete(notification.id, e)}
                  title="Delete notification"
                >
                  ✕
                </DeleteBtn>
              </NotificationContent>
            </NotificationItem>
          ))
        )}
      </NotificationDropdown>
    </BellContainer>
  );
};

export default NotificationBell;
