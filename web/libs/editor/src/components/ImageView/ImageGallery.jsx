import React, { useEffect, useState } from "react";

export default function ImageGallery({ projectId, imageName, taskId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !imageName) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/tasks/?project=${projectId}&image_name=${imageName}`
        );
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, imageName]);

  if (loading) return <div>Loading...</div>;
  if (!tasks.length) return <div>No tasks found</div>;

  return (
    <div
      className="grid grid-cols-6 gap-4 mt-4"
      style={{ gridColumn: "1 / -1" }}
    >
      {tasks.map((task) => (
        <div
          key={task.id}
          className="cursor-pointer rounded shadow"
          style={{
            width: "120px",
            height: "300px",
            border: task.id === taskId ? "2px solid #FF69B4" : "none",
            backgroundImage: `url(${task.data.image})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onClick={() =>
            (window.location.href = `/projects/${projectId}/data?tab=4&task=${task.id}`)
          }
        />
      ))}
    </div>
  );
}
