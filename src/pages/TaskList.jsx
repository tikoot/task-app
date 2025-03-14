import { useState, useEffect } from "react";
import axios from "axios";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const token = "9e6a6811-52b5-49ef-bb0d-19a0903805d5";
  
  const statusColors = {
    "დასაწყები": "bg-[#F7BC30]",
    "პროგრესში": "bg-[#FB5607]",
    "მზად ტესტირებისთვის": "bg-pink-500 ",
    "დასრულებული": "bg-[#3A86FF]",
    
  };


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

  const fetchStatuses = async () => {
    try {
      const response = await axios.get("https://momentum.redberryinternship.ge/api/statuses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setStatuses(response.data);
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };


  useEffect(() => {
    const loadAllData = async () => {
      await fetchTasks();
      await fetchStatuses();
    };
    
    loadAllData();
  }, []);


  const tasksByStatus = tasks.reduce((grouped, task) => {
    const statusName = task.status.name;
    if (!grouped[statusName]) {
      grouped[statusName] = [];
    }
    grouped[statusName].push(task);
    return grouped;
  }, {});


  const getStatusColor = (statusName) => {
    return statusColors[statusName] ;
  };



  return (
    <div className="pt-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-12">
        დავალებების გვერდი
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <div key={status.id} className="col-span-1">
             <h3 className={`${getStatusColor(status.name)} text-white py-2 px-4 rounded mb-4`}>
              {status.name}
            </h3>
            
            <div className="space-y-4">
              {tasksByStatus[status.name]?.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md"
                >
                  <h4 className="text-lg font-semibold mb-2">{task.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center">
                      <img
                        src={task.employee.avatar}
                        alt={task.employee.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm">{task.employee.name} {task.employee.surname}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <img
                        src={task.priority.icon}
                        alt={task.priority.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span className="text-sm">{task.priority.name}</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-500 text-xs mt-3">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {(!tasksByStatus[status.name] || tasksByStatus[status.name].length === 0) && (
                <div className="text-gray-400 text-center py-6 border rounded-lg">
                  No tasks 
                </div>
              )}
            </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListPage;
