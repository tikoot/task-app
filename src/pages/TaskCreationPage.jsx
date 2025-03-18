import { useState, useEffect } from "react"; 
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import EmployeModal from "../components/EmployeModal";

const TaskCreationPage = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ 
    mode: "onChange",
    defaultValues: { 
      priority: 2 ,
      status: 1
    }
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [token, setToken] = useState("9e76e164-1b7c-49c4-a4f5-7376c746103f");

  const selectedDepartment = watch("department");
  const selectedEmployee = watch("responsibleEmployee");
  const [selectedEmployeeState, setSelectedEmployeeState] = useState(selectedEmployee);

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
          setDepartments([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
          filterEmployeesByDepartment(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/priorities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPriorities(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
          setPriorities([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching priorities:", error);
        setPriorities([]);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/statuses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setStatuses(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
          setStatuses([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching statuses:", error);
        setStatuses([]);
      });
  }, [token]);

  const filterEmployeesByDepartment = (allEmployees) => {
    if (selectedDepartment) {
      const filtered = allEmployees.filter(
        (emp) => emp.department.id === parseInt(selectedDepartment)
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  };

  useEffect(() => {
    if (selectedDepartment && employees.length > 0) {
      filterEmployeesByDepartment(employees);
    }
  }, [selectedDepartment, employees]);



useEffect(() => {
    if (selectedDepartment && employees.length > 0) {
      filterEmployeesByDepartment(employees);
    }
  }, [selectedDepartment, employees]);
  
  useEffect(() => {
    if (selectedDepartment) {
      setValue("responsibleEmployee", "");
    }
  }, [selectedDepartment, setValue]);

  const onSubmit = (data) => {
    const taskData = {
      name: data.title,
      description: data.description,
      due_date: data.deadline.toISOString().split('T')[0],
      status_id: data.status,
      employee_id: selectedEmployeeState,
      priority_id: data.priority,
    };
    
    axios
      .post("https://momentum.redberryinternship.ge/api/tasks", taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
      
        reset({
          title: data.title,
          description: data.description,
          deadline: data.deadline,
          status: data.status,
          priority: data.priority,
        }); 
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        alert("There was an error creating the task.");
      });
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (empId, empName) => {
    setSelectedEmployeeState(empId);
    setValue("responsibleEmployee", empId);
    setIsOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
return (
  <section>
 <h2 className="text-[34px] font-bold mb-[25px] text-[#212529]">შექმენი ახალი დავალება</h2>
  <div className=" rounded-[4px] border border-[#DDD2FF] bg-[#F8F3FEA6] pt-[64px] px-[55px] pb-[145px]">
    
  <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-x-[161px]">
      <div className="space-y-8">
      <div>
          <label className="block text-md text-[#343A40]  mb-[6px]">
            სათაური*
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              minLength: { value: 2, message: "Title must be at least 2 characters" },
              maxLength: { value: 255, message: "Title must be less than 255 characters" }
            })}
            type="text"
            className="w-[550px] bg-white border border-[#DEE2E6] rounded-[5px] p-2"
          />
          <p
            className={`text-[10px] ${
              errors.title
                ? "text-red-500"
                : watch("title") && watch("title").length >= 2
                ? "text-[#08A508]"
                : "text-[#6C757D]"
            }`}
          >
            მინიმუმ 2 სიმბოლო
            <br />
            მაქსიმუმ 255 სიმბოლო
          </p>
    </div>

        <div>
          <label className="block text-md text-[#343A40]  mb-[6px]">აღწერა</label>
          <textarea {...register("description", {
              minLength: { value: 4, message: "Description should be at least 4 words" },
              maxLength: { value: 255, message: "Description should be less than 255 characters" }
          })}
          className="w-[550px] h-[160px] resize-none bg-white border border-[#DEE2E6] rounded-[5px] p-2"
          />
           <p
            className={`text-[10px] ${
              errors.description
                ? "text-red-500"
                : watch("description") && watch("description").length >= 2
                ? "text-[#08A508]"
                : "text-[#6C757D]"
            }`}
          >
            მინიმუმ 2 სიმბოლო
            <br />
            მაქსიმუმ 255 სიმბოლო
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-md text-[#343A40] mb-[6px]">დეპარტამენტი*</label>
          <select {...register("department", { required: "Department is required" })}
            className="w-[550px] bg-white border border-[#DEE2E6] rounded-[5px] p-2">
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
         
        </div>

        {selectedDepartment && (
              <div>
                <label className={`block  block text-md mb-[6px] ${!selectedDepartment ? 'text-[#ADB5BD]' : 'text-[#343A40]'}`}>პასუხისმგებელი თანამშრომელი*</label>
                <div
                  className={`w-[550px] p-2 border rounded bg-white min-h-[41px] ${!selectedDepartment ? 'text-[#ADB5BD] border-[#ADB5BD] cursor-not-allowed min-h-[41px]' : 'border-[#DEE2E6] cursor-pointer'}`}
                  onClick={() => setIsOpen(!isOpen)}
                  style={{ position: 'relative' }}
                  disabled={!selectedDepartment}
                >
   <div className="flex items-center">
  {selectedEmployeeState && filteredEmployees.length > 0 ? (
    filteredEmployees
      .filter(emp => emp.id === selectedEmployeeState)
      .map(emp => (
        <div key={emp.id} className="flex items-center">
          {emp.avatar && (
            <img
              src={emp.avatar}
              alt={`${emp.name} ${emp.surname}'s avatar`}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          {emp.name} {emp.surname}
        </div>
      ))
  ) : (
    <span className="flex items-end justify-end ml-auto">
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.62 5.7207L7.81667 9.52404C7.3675 9.9732 6.6325 9.9732 6.18334 9.52404L2.38 5.7207" stroke="#343A40" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    </span>
  )}
</div>

                  {isOpen && (
                    <ul
                      className="absolute left-0 right-0 top-10 mt-1 bg-white border border-[#DEE2E6] rounded-[5px] max-h-60 overflow-auto"
                      style={{ zIndex: 1000 }}
                    >
                       <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                       <button  onClick={openModal} className=" text-[#8338EC] cursor-pointer rounded-[5px] p-[15px]  text-md flex items-center">
                       <svg className="mr-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.75" y="0.75" width="16.5" height="16.5" rx="8.25" stroke="#8338EC" stroke-width="1.5"/>
                          <path d="M9.576 8.456H13.176V9.656H9.576V13.304H8.256V9.656H4.656V8.456H8.256V4.808H9.576V8.456Z" fill="#8338EC"/>
                          </svg>

                       დაამატე თანამშრომელი
        </button>
          </li>
                      {filteredEmployees.map(emp => {
                        const isDisabled = emp.department.id !== parseInt(selectedDepartment);
                        if (isDisabled) return null;

                        return (
                          <li
                            key={emp.id}
                            onClick={() => handleSelect(emp.id, `${emp.name} ${emp.surname}`)}
                            className="flex items-center pl-[15px] pt-2 pb-2 pr-2 hover:bg-gray-100 cursor-pointer"
                          >
                           
                            {emp.avatar && (
                              <img
                                src={emp.avatar}
                                alt={`${emp.name} ${emp.surname}'s avatar`}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            )}
                            {emp.name} {emp.surname}
                          </li>
                        );
                      })}
                      
                    </ul>
                  )}
                </div>
              </div>
            )}

        
      </div>
      </div>
    
  
      <div className="pt-[55px]">
        <div className="grid grid-cols-2 gap-x-[161px]">
        <div className="grid grid-cols-2 gap-x-[32px] max-w-[550ps] ">
          <div className="w-[259px] ">
            <label className="block text-md text-[#343A40]  mb-[6px]">პრიორიტეტი*</label>
            <select {...register("priority", { required: "Priority is required" })}
              className="w-[259px] bg-white border border-[#DEE2E6] rounded-[5px] p-2">
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id} selected={priority.id === 2}>
                  {priority.name}
                </option>
              ))}
            </select>
            {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
          </div>

          <div className="w-[259px]">
            <label className="block text-md text-[#343A40]  mb-[6px]">სტატუსი*</label>
            <select {...register("status", { required: "Status is required" })}
              className="w-[259px] bg-white border border-[#DEE2E6] rounded-[5px] p-2">
              {statuses.map((status) => (
                <option key={status.id} value={status.id} selected={status.id === 1}>
                  {status.name}
                </option>
              ))}
            </select>
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>
        </div>
        <div>
            <label className="block text-md text-[#343A40]  mb-[6px]">დედლაინი</label>
            <Controller
  control={control}
  name="deadline"
  rules={{ required: "Deadline is required" }}
  defaultValue={new Date().setDate(new Date().getDate() + 1)}
  render={({ field }) => (
    <DatePicker
      selected={field.value ? new Date(field.value) : new Date()}  
      onChange={(date) => field.onChange(date)}  
      minDate={new Date()}  
      className="w-[259px] bg-white border border-[#DEE2E6] rounded-[5px] p-2"
    />
  )}
/>
          </div>
        </div>
     
      </div>
      <div className="col-span-2 pt-[145px] justify-end justify-items-end ">
        <button type="submit" className="bg-[#8338EC] hover:bg-[#B588F4] text-white rounded-[5px] px-[20px] py-[10px] text-md flex items-center cursor-pointer">
        დავალების შექმნა
        </button>
      </div>
    </form>
  </div>
  <EmployeModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
  </section>

);
};

export default TaskCreationPage;


