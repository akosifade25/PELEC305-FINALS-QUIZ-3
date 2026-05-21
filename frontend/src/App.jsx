import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), is_completed: false }),
      });
      if (res.ok) {
        setTitle("");
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  const toggleTask = async (task) => {
    try {
      await fetch(`${API_URL}${task.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task.");
    }
  };

  return (
    <div style={{
      margin: 0,
      padding: "48px 40px",
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box",
      background: "#f5f6fa",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: "700" }}>✦</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#111827" }}>Task Board</h1>
        </div>

        {/* Add Task Card */}
        <div style={styles.card}>
          <p style={styles.cardLabel}>NEW TASK</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              style={styles.input}
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              style={{ ...styles.addBtn, opacity: adding ? 0.7 : 1 }}
              onClick={addTask}
              disabled={adding}
            >
              {adding ? "Adding..." : "+ Add Task"}
            </button>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>{error}</p>}
        </div>

        {/* Task List Card */}
        <div style={styles.card}>
          <p style={styles.cardLabel}>ALL TASKS</p>

          {loading ? (
            <p style={styles.emptyText}>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p style={styles.emptyText}>No tasks yet. Add one above!</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {tasks.map((task) => (
                <li key={task.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}>
                  {/* Checkbox */}
                  <div
                    onClick={() => toggleTask(task)}
                    style={{
                      width: "22px",
                      height: "22px",
                      minWidth: "22px",
                      borderRadius: "6px",
                      border: `2px solid ${task.is_completed ? "#2563eb" : "#d1d5db"}`,
                      background: task.is_completed ? "#2563eb" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {task.is_completed && (
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline
                          points="2,7 5,10 11,3"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Task title */}
                  <span style={{
                    flex: 1,
                    fontSize: "15px",
                    fontWeight: "500",
                    textDecoration: task.is_completed ? "line-through" : "none",
                    color: task.is_completed ? "#9ca3af" : "#111827",
                  }}>
                    {task.title}
                  </span>

                  {/* Status badge */}
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: task.is_completed ? "#eff6ff" : "#fef9c3",
                    color: task.is_completed ? "#2563eb" : "#a16207",
                    border: task.is_completed ? "1px solid #bfdbfe" : "1px solid #fde047",
                    whiteSpace: "nowrap",
                  }}>
                    {task.is_completed ? "Done" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    border: "1px solid #e5e7eb",
    marginBottom: "20px",
  },
  cardLabel: {
    margin: "0 0 14px 0",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#9ca3af",
    textTransform: "uppercase",
    textAlign: "left",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "15px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    outline: "none",
    background: "#f9fafb",
    color: "#111827",
  },
  addBtn: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px 0",
    margin: 0,
  },
};
