import { useState, useEffect } from "react"; 
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { FaCheck, FaTimes } from "react-icons/fa";

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

  const [token, setToken] = useState("9e6a6811-52b5-49ef-bb0d-19a0903805d5");

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
        alert("Task created successfully!");
      
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
  

return (
  <section>
 <h2 className="text-[34px] font-bold mb-[25px] text-[#212529]">შექმენი ახალი დავალება</h2>
  <div className=" rounded-[4px] border border-[#DDD2FF] bg-[#F8F3FEA6] pt-[64px] px-[55px] pb-[145px]">
    
  <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-x-[161px]">
      <div className="space-y-8">
      <div>
          <label className="block text-md text-[#343A40] font-semibold mb-[6px]">
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
          <label className="block text-md text-[#343A40] font-semibold mb-[6px]">აღწერა</label>
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
          <label className="block text-md text-[#343A40] font-semibold mb-[6px]">დეპარტამენტი*</label>
          <select {...register("department", { required: "Department is required" })}
            className="w-[550px] bg-white border border-[#DEE2E6] rounded-[5px] p-2">
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
         
        </div>

        <div>
          <label className= {`block font-semibold block text-md mb-[6px] ${!selectedDepartment ? 'text-[#ADB5BD] ' : 'text-[#343A40]'}`}>პასუხისმგებელი თანამშრომელი*</label>
          <select
          {...register("responsibleEmployee", {
            required: selectedDepartment ? "Responsible Employee is required" : false,
          })}
          className={`w-[550px] p-2 border rounded bg-white ${!selectedDepartment ? 'text-[#ADB5BD] border-[#ADB5BD] cursor-not-allowed' : 'border-[#DEE2E6] cursor-pointer'}`}
          disabled={!selectedDepartment}
          value={selectedEmployeeState || ""}
          onChange={(e) => {
            setSelectedEmployeeState(e.target.value);
            setValue("responsibleEmployee", e.target.value);
          }}
        >
          <option value=""></option>
          {filteredEmployees.map((emp) => {
            const isDisabled = emp.department.id !== parseInt(selectedDepartment);
            if (isDisabled) return null; 
            return (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.surname}
              </option>
            );
          })}
        </select>
          {/* {errors.responsibleEmployee && <p className="text-red-500">{errors.responsibleEmployee.message}</p>} */}
        </div>

        
      </div>
      </div>
    
  
      <div className="pt-[55px]">
        <div className="grid grid-cols-2 gap-x-[161px]">
        <div className="grid grid-cols-2 gap-x-[32px] max-w-[550ps] ">
          <div className="w-[259px] ">
            <label className="block text-md text-[#343A40] font-semibold mb-[6px]">პრიორიტეტი*</label>
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
            <label className="block text-md text-[#343A40] font-semibold mb-[6px]">სტატუსი*</label>
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
            <label className="block text-md text-[#343A40] font-semibold mb-[6px]">დედლაინი</label>
            <Controller
              control={control}
              name="deadline"
              rules={{ required: "Deadline is required" }}
              defaultValue={new Date().setDate(new Date().getDate() + 1)}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
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
        <button type="submit" className="bg-[#8338EC] text-white rounded-[5px] px-[20px] py-[10px] text-md flex items-center cursor-pointer">
        დავალების შექმნა
        </button>
      </div>
    </form>
  </div>
  </section>
 
);
};

export default TaskCreationPage;


