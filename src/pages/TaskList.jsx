import { useState, useEffect } from "react";
import axios from "axios";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const token = "9e6a6811-52b5-49ef-bb0d-19a0903805d5";
  
  const statusColors = {
    "დასაწყები": "bg-[#F7BC30]",
    "პროგრესში": "bg-[#FB5607]",
    "მზად ტესტირებისთვის": "bg-pink-500",
    "დასრულებული": "bg-[#3A86FF]",
  };

  const statusBorderColors = {
    "დასაწყები": "border-[#F7BC30]",
    "პროგრესში": "border-[#FB5607]",
    "მზად ტესტირებისთვის": "border-pink-500",
    "დასრულებული": "border-[#3A86FF]",
  };

  const departmentColors = {
    1: "bg-[#FF66A8]",
    2: "bg-[#FD9A6A]",
    3: "bg-[#89B6FF]",
    4: "bg-[#FFD86D]",
    5: "bg-[#FFD86D]",
    6: "bg-[#89B6FF]",
    7: "bg-[#FF66A8]",
  };
  
  const priorityStyles = {
    "მაღალი": {
      textColor: "text-[#FA4D4D]",
      borderColor: "border-[#FA4D4D]",
    },
    "საშუალო": {
      textColor: "text-[#FFBE0B]",
      borderColor: "border-[#FFBE0B]",
    },
    "დაბალი": {
      textColor: "text-green-600",
      borderColor: "border-[#08A508]",

    }
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
    return statusColors[statusName];
  };

  const getBorderColor = (statusName) => {
    return statusBorderColors[statusName];
  };

  const getDepartmentColor = (departmentId) => {
    return departmentColors[departmentId];
  };

  const getPriorityStyles = (priorityName) => {
    return priorityStyles[priorityName];
  };
  
  const truncateText = (text, maxLength = 10) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="pt-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-12">
        დავალებების გვერდი
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <div key={status.id} className="col-span-1">
            <h3 className={`${getStatusColor(status.name)} text-white py-[15px] text-xl rounded-[10px] mb-[30px] text-center`}>
              {status.name}
            </h3>
            
            <div className="space-y-4">
              {tasksByStatus[status.name]?.slice(0, 4).map((task) => {
                const priorityStyle = getPriorityStyles(task.priority.name);
                
                return (
                  <div
                    key={task.id}
                    className={`${getBorderColor(task.status.name)} border p-[20px] rounded-[15px] hover:shadow-md transition-shadow`}
                  >
                    <h4 className="text-lg font-semibold mb-2">
                      {truncateText(task.name, 30)}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {truncateText(task.description, 60)}
                    </p>
                    
                    <div className="flex justify-between mt-4 items-center flex-wrap gap-2">
                      <div className="flex items-center">
                        <img
                          src={task.employee.avatar}
                          alt={task.employee.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm">
                          {truncateText(`${task.employee.name} ${task.employee.surname}`, 15)}
                        </span>
                      </div>
                    
                      <div className="flex items-center">
                        <img
                          src={task.priority.icon}
                          alt={task.priority.name}
                          className="w-5 h-5 mr-1"
                        />
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityStyle.bgColor} ${priorityStyle.textColor} ${priorityStyle.borderColor}`}>
                          {task.priority.name}
                        </span>
                      </div>
                      
                      <div className={`${getDepartmentColor(task.department.id)} px-2 py-1 rounded-md text-xs`}>
                        {truncateText(task.department.name, 12)}
                      </div>
                    </div>
                    
                    <div className="text-gray-500 text-xs mt-3">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
              
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