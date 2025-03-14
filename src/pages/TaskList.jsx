import { useState, useEffect } from "react";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-12">Tasks</h2>
    </div>
  );
};

export default TaskListPage;