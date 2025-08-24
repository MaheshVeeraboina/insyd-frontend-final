import React, { useEffect, useState } from "react";

const API_BASE = "https://insyd-backend-final-2.onrender.com/api"; // Local backend

function App() {
  const [users, setUsers] = useState([]);
  const [sourceUserId, setSourceUserId] = useState(null);
  const [targetUserId, setTargetUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all users
  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to fetch users"));
  }, []);

  // Fetch notifications for target user
  useEffect(() => {
    if (!targetUserId) return;

    const fetchNotifications = () => {
      fetch(`${API_BASE}/notifications/${targetUserId}`)
        .then((res) => res.json())
        .then((data) => setNotifications(data.notifications))
        .catch(() => setError("Failed to fetch notifications"));
    };

    fetchNotifications();
  }, [targetUserId]);

  // Simulate an event
  const simulateEvent = (type) => {
    if (!sourceUserId || !targetUserId)
      return alert("Select both source and target users!");

    const body = {
      type,
      source_user_id: sourceUserId,
      target_user_id: targetUserId,
      comment: type === "comment" ? "Nice post!" : undefined,
      post_title: type === "post" ? `Post #${Math.floor(Math.random() * 100)}` : undefined,
    };

    fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(() => {
        // Fetch notifications for target user after event
        fetch(`${API_BASE}/notifications/${targetUserId}`)
          .then((res) => res.json())
          .then((data) => setNotifications(data.notifications))
          .catch(() => setError("Failed to fetch notifications"));
      })
      .catch(() => setError("Failed to simulate event"));
  };

  const markAsRead = (id) => {
    fetch(`${API_BASE}/notifications/${id}/read`, { method: "PATCH" })
      .then(() => {
        fetch(`${API_BASE}/notifications/${targetUserId}`)
          .then((res) => res.json())
          .then((data) => setNotifications(data.notifications))
          .catch(() => setError("Failed to fetch notifications"));
      })
      .catch(() => setError("Failed to mark notification as read"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📢 Insyd Notification POC</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Select Source User (Actor)</h2>
      <select
        value={sourceUserId || ""}
        onChange={(e) => setSourceUserId(Number(e.target.value))}
      >
        <option value="">--Select User--</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <h2>Select Target User (Receiver)</h2>
      <select
        value={targetUserId || ""}
        onChange={(e) => setTargetUserId(Number(e.target.value))}
      >
        <option value="">--Select User--</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <h2>Simulate Event</h2>
      <button onClick={() => simulateEvent("like")}>Like</button>
      <button onClick={() => simulateEvent("comment")}>Comment</button>
      <button onClick={() => simulateEvent("follow")}>Follow</button>
      <button onClick={() => simulateEvent("post")}>New Post</button>

      <h2>Notifications for {users.find(u => u.id === targetUserId)?.username || ""}</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              <strong>[{n.type}]</strong> {n.content}{" "}
              {n.status === "unread" && (
                <button onClick={() => markAsRead(n.id)}>Mark as read</button>
              )}
              <br />
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
