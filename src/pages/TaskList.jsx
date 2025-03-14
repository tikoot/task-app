import { useState, useEffect } from "react";
import axios from "axios";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const token = "9e6a6811-52b5-49ef-bb0d-19a0903805d5";
  
  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://momentum.redberryinternship.ge/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-12">Tasks</h2>
      { tasks.map((task) => (
            <div key={task.id} className="mb-4">
              <h3 className="text-xl font-semibold">{task.name}</h3>
              <p className="text-gray-600">{task.description}</p>
              <div className="text-gray-500 text-xs">
                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))

}
</div>
  );
};

export default TaskListPage;
