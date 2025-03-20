import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import comment from '../assets/comments.png'
import "../index.css";
const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    departments: [],
    priorities: [],
    employee: null
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  const [tempSelections, setTempSelections] = useState({
    departments: [],
    priorities: [],
    employee: null
  });
  
  const token = "9e76e164-1b7c-49c4-a4f5-7376c746103f";
  
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

  useEffect(() => {
    const savedFilters = localStorage.getItem('taskFilters'); 
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setFilters(parsedFilters);
      setTempSelections(parsedFilters);
    }
  }, []);
  
  useEffect(() => {
    if (filters.departments.length > 0 || filters.priorities.length > 0 || filters.employee !== null) {
      localStorage.setItem('taskFilters', JSON.stringify(filters)); 
    }
  }, [filters]);
  
  useEffect(() => {
    return () => {
      localStorage.removeItem('taskFilters'); 
    };
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://momentum.redberryinternship.ge/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setTasks(response.data);
        setFilteredTasks(response.data);
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

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://momentum.redberryinternship.ge/api/departments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await axios.get("https://momentum.redberryinternship.ge/api/priorities", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setPriorities(response.data);
      }
    } catch (error) {
      console.error("Error fetching priorities:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://momentum.redberryinternship.ge/api/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      await fetchTasks();
      await fetchStatuses();
      await fetchDepartments();
      await fetchPriorities();
      await fetchEmployees();
    };
    
    loadAllData();
  }, []);


  useEffect(() => {
    if (tasks.length > 0) {
      applyFilters();
    }
  }, [filters, tasks]);

  const applyFilters = () => {
    let result = [...tasks];
    

    if (filters.departments.length > 0) {
      result = result.filter(task => 
        filters.departments.includes(task.department.id)
      );
    }
    

    if (filters.priorities.length > 0) {
      result = result.filter(task => 
        filters.priorities.includes(task.priority.id)
      );
    }
    

    if (filters.employee) {
      result = result.filter(task => 
        task.employee.id === filters.employee
      );
    }
    
    setFilteredTasks(result);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(prevDropdown => prevDropdown === dropdown ? null : dropdown);
  };

  const handleTempDepartmentChange = (departmentId) => {
    setTempSelections(prev => {
      const updatedDepartments = prev.departments.includes(departmentId)
        ? prev.departments.filter(id => id !== departmentId)
        : [...prev.departments, departmentId];
      
      return { ...prev, departments: updatedDepartments };
    });
  };

  const handleTempPriorityChange = (priorityId) => {
    setTempSelections(prev => {
      const updatedPriorities = prev.priorities.includes(priorityId)
        ? prev.priorities.filter(id => id !== priorityId)
        : [...prev.priorities, priorityId];
      
      return { ...prev, priorities: updatedPriorities };
    });
  };

  const handleTempEmployeeChange = (employeeId) => {
    setTempSelections(prev => ({
      ...prev, 
      employee: prev.employee === employeeId ? null : employeeId
    }));
  };

  const applyDepartmentFilters = () => {
    setFilters(prev => ({
      ...prev,
      departments: tempSelections.departments
    }));
    setActiveDropdown(null);
  };

  const applyPriorityFilters = () => {
    setFilters(prev => ({
      ...prev,
      priorities: tempSelections.priorities
    }));
    setActiveDropdown(null);
  };

  const applyEmployeeFilter = () => {
    setFilters(prev => ({
      ...prev,
      employee: tempSelections.employee
    }));
    setActiveDropdown(null);
  };

  const removeFilter = (type, id = null) => {
    if (type === 'departments') {
      setFilters(prev => ({
        ...prev,
        departments: prev.departments.filter(deptId => deptId !== id)
      }));
      setTempSelections(prev => ({
        ...prev,
        departments: prev.departments.filter(deptId => deptId !== id)
      }));
    } else if (type === 'priorities') {
      setFilters(prev => ({
        ...prev,
        priorities: prev.priorities.filter(prioId => prioId !== id)
      }));
      setTempSelections(prev => ({
        ...prev,
        priorities: prev.priorities.filter(prioId => prioId !== id)
      }));
    } else if (type === 'employee') {
      setFilters(prev => ({ ...prev, employee: null }));
      setTempSelections(prev => ({ ...prev, employee: null }));
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      departments: [],
      priorities: [],
      employee: null
    };
    setFilters(emptyFilters);
    setTempSelections(emptyFilters);
  };

  const tasksByStatus = filteredTasks.reduce((grouped, task) => {
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

  const getDepartmentById = (id) => {
    return departments.find(dept => dept.id === id);
  };

  const getPriorityById = (id) => {
    return priorities.find(priority => priority.id === id);
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id);
  };

  return (
    <div className="pt-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-12">
        დავალებების გვერდი
      </h2>

      <div className="mb-[38px]">
       

<div className="grid grid-cols-1 md:grid-cols-3  gap-[45px] max-w-1/2 border  border-[#DEE2E6] rounded-[10px] px-[18px] py-[12px]">
 <div className="relative filter-dropdown">
   <button
     onClick={() => toggleDropdown('departments')}
     className={`grid grid-cols-2 gap-[8px] bg-white cursor-pointer border-none text-md ${activeDropdown === 'departments' ? 'text-[#8338EC]' : 'text-[#0D0F10]'}`}
   >
     <span>დეპარტამენტი</span>
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L11.2929 15.7071C11.6834 16.0976 12.3166 16.0976 12.7071 15.7071L18.7071 9.70711C19.0976 9.31658 19.0976 8.68342 18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289L12 13.5858L6.70711 8.29289Z" fill={activeDropdown === 'departments' ? '#8338EC' : '#0D0F10'}/>
      </svg>

   </button>
   
   {activeDropdown === 'departments' && (
     <div className="absolute z-10 mt-6 w-full bg-white border border-[#8338EC] rounded-[10px] min-w-[500px]">
       <div className="px-[30px] pt-[40px] pb-[20px]">
         <div className="max-h-48 overflow-y-auto">
           {departments.map(department => (
             <div key={department.id} className="flex items-center mb-2">
               <input
                 type="checkbox"
                 id={`dept-${department.id}`}
                 checked={tempSelections.departments.includes(department.id)}
                 onChange={() => handleTempDepartmentChange(department.id)}
                 className="mr-2"
               />
               <label htmlFor={`dept-${department.id}`} className="text-md cursor-pointer">
                 {department.name}
               </label>
             </div>
           ))}
         </div>
         <div className="flex justify-end mt-3">
           <button
             onClick={applyDepartmentFilters}
             className="px-[45px] hover:bg-[#B588F4] py-1 bg-[#8338EC] text-white rounded-[20px] text-sm"
           >
             არჩევა
           </button>
         </div>
       </div>
     </div>
   )}
 </div>

 <div className="relative filter-dropdown">
   <button
     onClick={() => toggleDropdown('priorities')}
     className={`grid grid-cols-2 gap-[8px] cursor-pointer bg-white border-none text-md ${activeDropdown === 'priorities' ? 'text-[#8338EC]' : 'text-[#0D0F10]'}`}
   >
     <span>პრიორიტეტი</span>
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L11.2929 15.7071C11.6834 16.0976 12.3166 16.0976 12.7071 15.7071L18.7071 9.70711C19.0976 9.31658 19.0976 8.68342 18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289L12 13.5858L6.70711 8.29289Z" fill={activeDropdown === 'priorities' ? '#8338EC' : '#0D0F10'}/>
      </svg>
   </button>
   
   {activeDropdown === 'priorities' && (
     <div className="absolute z-10 mt-6 w-full bg-white border border-[#8338EC] rounded-[10px] min-w-[500px]">
       <div className="px-[30px] pt-[40px] pb-[20px]">
         <div className="max-h-48 overflow-y-auto">
           {priorities.map(priority => (
             <div key={priority.id} className="flex items-center mb-2">
               <input
                 type="checkbox"
                 id={`prio-${priority.id}`}
                 checked={tempSelections.priorities.includes(priority.id)}
                 onChange={() => handleTempPriorityChange(priority.id)}
                 className="mr-2"
               />
               <label className="text-md cursor-pointer flex items-center">
                 {priority.name}
               </label>
             </div>
           ))}
         </div>
         <div className="flex justify-end mt-3">
           <button
             onClick={applyPriorityFilters}
             className="px-[45px] py-1 hover:bg-[#B588F4]  bg-[#8338EC] text-white rounded-[20px] text-sm"
           >
             არჩევა
           </button>
         </div>
       </div>
     </div>
   )}
 </div>
 
 
 <div className="relative filter-dropdown">
   <button
     onClick={() => toggleDropdown('employees')}
     className={`grid grid-cols-2 gap-[20px] cursor-pointer bg-white border-none text-md ${activeDropdown === 'employees' ? 'text-[#8338EC]' : 'text-[#0D0F10]'}`}
   >
     <span>თანამშრომელი</span>
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L11.2929 15.7071C11.6834 16.0976 12.3166 16.0976 12.7071 15.7071L18.7071 9.70711C19.0976 9.31658 19.0976 8.68342 18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289L12 13.5858L6.70711 8.29289Z" fill={activeDropdown === 'employees' ? '#8338EC' : '#0D0F10'}/>
      </svg>
   </button>
   
   {activeDropdown === 'employees' && (
  <div className="absolute z-10 mt-6 w-full bg-white border border-[#8338EC] rounded-[10px] min-w-[500px]">
    <div className="px-[30px] pt-[40px] pb-[20px]">
      <div className="max-h-48 overflow-y-auto">
        {employees.map(employee => (
          <div key={employee.id} className="flex items-center mb-2">
            <input
              type="radio"
              id={`emp-${employee.id}`}
              name="employee"
              checked={tempSelections.employee === employee.id}
              onChange={() => handleTempEmployeeChange(employee.id)}
              className="mr-2 custom-radio"
            />
            <label htmlFor={`emp-${employee.id}`} className="text-sm cursor-pointer flex items-center">
              <img src={employee.avatar} alt={`${employee.name} ${employee.surname}`} className="w-6 h-6 rounded-full mr-2" />
              {employee.name} {employee.surname}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-3">
        <button
          onClick={applyEmployeeFilter}
          className="px-[45px] hover:bg-[#B588F4] py-1 bg-[#8338EC] text-white rounded-[20px] text-sm"
        >
          არჩევა
        </button>
      </div>
    </div>
  </div>
)}
 </div>
</div>
{(filters.departments.length > 0 || filters.priorities.length > 0 || filters.employee) && (
          <div className="mt-[24px] flex flex-wrap gap-2">
            {filters.departments.map(deptId => {
              const dept = getDepartmentById(deptId);
              if (!dept) return null;
              return (
                <div 
                  key={`selected-dept-${deptId}`}
                  className="text-[#343A40]  px-3 py-1 rounded-[43px] border border-[#343A40] text-xs flex items-center gap-1"
                >
                  {dept.name}
                  <button 
                    onClick={() => removeFilter('departments', deptId)}
                    className="ml-1  rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            
            {filters.priorities.map(prioId => {
              const priority = getPriorityById(prioId);
              if (!priority) return null;
              const style = getPriorityStyles(priority.name);
              return (
                <div 
                  key={`selected-prio-${prioId}`}
                  className="text-[#343A40]  px-3 py-1 rounded-[43px] border border-[#343A40] text-xs flex items-center gap-1"
                >
                  
                  {priority.name}
                  <button 
                    onClick={() => removeFilter('priorities', prioId)}
                    className="ml-1  rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            
            {filters.employee && (
              <div 
                key={`selected-emp-${filters.employee}`}
                className="text-[#343A40]  px-3 py-1 rounded-[43px] border border-[#343A40] text-xs flex items-center gap-1"
              >
                {getEmployeeById(filters.employee) && (
                  <>
                    <img 
                      src={getEmployeeById(filters.employee).avatar} 
                      alt={getEmployeeById(filters.employee).name} 
                      className="w-4 h-4 rounded-full"
                    />
                    {getEmployeeById(filters.employee).name} {getEmployeeById(filters.employee).surname}
                  </>
                )}
                <button 
 onClick={() => removeFilter('employee')}
 className="ml-1  rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
>
 ✕
</button>
</div>
)}
 <button
              onClick={clearFilters}
              className="text-sm text-[#343A40] cursor-pointer"
            >
              გასუფთავება
            </button>
</div>
)}

</div>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[52px] pt-[35px] auto-rows-fr">
 {statuses.map((status) => (
   <div>
     <div key={status.id} className="col-span-1">
    
   <h3 className={`${getStatusColor(status.name)} text-white py-[15px] text-xl rounded-[10px] mb-[30px] text-center`}>
     {status.name}
   </h3>
   </div>
   <div className=" space-y-[30px]">
     {tasksByStatus[status.name]?.slice(0, 4).map((task) => {
       const priorityStyle = getPriorityStyles(task.priority.name);
       
       return (
         <Link
           to={`/tasks/${task.id}`} 
           key={task.id}
           className="block"
         >
           <div
             className={`${getBorderColor(task.status.name)} border p-[20px] rounded-[15px] min-h-[270px]`}
           >
             <div className="flex items-center justify-between">
               <div className="flex items-center justify-center gap-[10px]">
                 <div className={`flex items-center rounded-[4px] border p-[4px] ${priorityStyle.borderColor}`}>
                   <img
                     src={task.priority.icon}
                     alt={task.priority.name}
                     className="w-5 h-5 mr-1"
                   />
                   <span className={`text-xs font-medium ${priorityStyle.textColor}`}>
                     {task.priority.name}
                   </span>
                 </div>
                 
                 <div className={`${getDepartmentColor(task.department.id)} px-[18px] py-[5px] text-white rounded-[15px] text-xs`}>
                   {truncateText(task.department.name, 12)}
                 </div>
               </div>
               <div className="text-[#212529] text-xs">
                 {new Date(task.due_date).toLocaleDateString()}
               </div>
             </div>
             <div className="px-[10px] py-7 ">
               <h4 className="text-[15px] text-[#191919] font-semibold mb-3">
                 {task.name}
               </h4>
               <p className="text-[#343A40] text-sm mb-3">
                 {task.description}
               </p>
             </div>
             
             <div className="flex justify-between mt-4 items-center flex-wrap gap-2 w-full">
               <div className="flex items-center justify-between w-full">
                 <img
                   src={task.employee.avatar}
                   alt={task.employee.name}
                   className="w-8 h-8 rounded-full"
                 />
                 <div className="text-sm flex items-center"><img src={comment} alt="comment logo" className="pr-[4px]" /> <p className="text-center pb-1">{task.total_comments}</p></div>
               </div>
             </div>
           </div>
         </Link>
       );
     })}
     
     {(!tasksByStatus[status.name] || tasksByStatus[status.name].length === 0) && (
       <div className="text-gray-400 text-center py-6 border rounded-lg">
         No tasks 
       </div>
     )}
   </div> </div>
  
   
 ))}
</div>
</div>
);
};

export default TaskListPage;