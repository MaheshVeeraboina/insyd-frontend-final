import React, { useEffect, useState, useCallback } from "react";

const API_BASE = "https://insyd-backend-final-2.onrender.com/api"; // change to deployed URL when ready

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

  // Fetch notifications for the target user
  const fetchNotifications = useCallback(() => {
    if (!targetUserId) return;
    fetch(`${API_BASE}/notifications/${targetUserId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications))
      .catch(() => setError("Failed to fetch notifications"));
  }, [targetUserId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Simulate an event
  const simulateEvent = (type) => {
    if (!sourceUserId || !targetUserId) return alert("Select both users!");

    let body = { type, source_user_id: sourceUserId, target_user_id: targetUserId };

    if (type === "comment") body.comment = "Nice post!";
    if (type === "post") body.post_title = `Post #${Math.floor(Math.random() * 100)}`;

    fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then(() => fetchNotifications())
      .catch(() => setError("Failed to simulate event"));
  };

  const markAsRead = (id) => {
    fetch(`${API_BASE}/notifications/${id}/read`, { method: "PATCH" })
      .then(() => fetchNotifications())
      .catch(() => setError("Failed to mark notification as read"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📢 Insyd Notification POC</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Source User (Who acts)</h2>
      <select
        value={sourceUserId || ""}
        onChange={(e) => setSourceUserId(Number(e.target.value))}
      >
        <option value="">Select user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <h2>Target User (Who receives notification)</h2>
      <select
        value={targetUserId || ""}
        onChange={(e) => setTargetUserId(Number(e.target.value))}
      >
        <option value="">Select user</option>
        {users
          .filter((user) => user.id !== sourceUserId) // Exclude source user
          .map((user) => (
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

      <h2>
        Notifications for{" "}
        {targetUserId && users.find((u) => u.id === targetUserId)?.username}
      </h2>
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
