import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Frame2 from "../assets/Frame2.png";
import piechart from "../assets/piechart.png";
import calendar from "../assets/calendar.png";

const TaskPage = () => {

    const { id } = useParams();
    const [task, setTask] = useState(null);
    const token = "9e6a6811-52b5-49ef-bb0d-19a0903805d5";

    useEffect(() => {
        const fetchTask = async () => {
          try {
            const response = await axios.get(`https://momentum.redberryinternship.ge/api/tasks/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setTask(response.data);
          } catch (error) {
            console.error("Error:", error);
          } finally {
          }
        };
    
        fetchTask();
      }, [id]);

      
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
      const priorityStyle = task && task.priority ? getPriorityStyles(task.priority.name) : {};

    const comments = [
      {
        id: 1,
        author: "უშანგი მშვიდაძე",
        avatar: "/api/placeholder/40/40",
        text: "ფილმის სიუჟეტი ძალიან ბავშვური კითხვისთვის მიმაჩნდევს ოღონდ, რაღაც ფილმებისთვის პროსტო ჩაწერილია.",
        date: "3 საათი"
      },
      {
        id: 2,
        author: "ნანუკა ღონღაძე",
        avatar: "/api/placeholder/40/40",
        text: "ფილმის სიუჟეტი ძალიან ბავშვური კითხვისთვის მიმაჩნდევს ოღონდ.",
        date: "3 საათი"
      },
      {
        id: 3,
        author: "უშანგი მშვიდაძე",
        avatar: "/api/placeholder/40/40",
        text: "ფილმის სიუჟეტი ძალიან ბავშვური კითხვისთვის მიმაჩნდევს ოღონდ, რაღაც ფილმებისთვის პროსტო ჩაწერილია.",
        date: "3 საათი"
      },
      {
        id: 4,
        author: "უშანგი მშვიდაძე",
        avatar: "/api/placeholder/40/40",
        text: "ფილმის სიუჟეტი ძალიან ბავშვური კითხვისთვის მიმაჩნდევს ოღონდ, რაღაც ფილმებისთვის პროსტო ჩაწერილია.",
        date: "3 საათი"
      }
    ];
  
    return (
        <div className="grid grid-cols-2 gap-[223px] pt-10">
        {!task ? (
          <div className="w-full text-center text-gray-500 py-10">Loading...</div>
        ) : (
            <>
            <div className="">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center justify-center gap-[10px]">
                  <div className={`flex items-center rounded-[4px] border p-[4px] ${priorityStyle.borderColor}`}>
                    {task.priority?.icon && (
                      <img
                        src={task.priority.icon}
                        alt={task.priority.name}
                        className="w-5 h-5 mr-1"
                      />
                    )}
                    <span className={`text-xs font-medium ${priorityStyle.textColor}`}>
                      {task.priority?.name || "Unknown"}
                    </span>
                  </div>
                  
                  <div className={`${getDepartmentColor(task.department?.id)} px-[18px] py-[5px] text-white rounded-[15px] text-xs`}>
                    {truncateText(task.department?.name || "", 12)}
                  </div>
                </div>
               
              </div>
  
              <h1 className="text-[34px] font-bold mb-[36px] text-[#212529] ">{task.name}</h1>
  
              <p className="text-gray-700 mb-[63px] text-[18px]">{task.description}</p>
  
              <h2 className="font-bold text-[24px] text-[#2A2A2A] mb-[28px]">დავალების დეტალები</h2>

              <div className="grid grid-cols-2 gap-[70px]">
                <div>
                    <div className="flex items-center"><img  src={piechart} alt="" /><p className="pl-[6px] text-[#474747] text-md" >სტატუსი</p></div>
                    <div className="flex items-center"><img  src={Frame2} alt="" /><p className="pl-[6px] text-[#474747] text-md">თანამშრომელი</p></div>
                    <div className="flex items-center"><img  src={calendar} alt="" /><p className="pl-[6px] text-[#474747] text-md">დავალების ვადა</p></div>
                </div>
                <div>
                    <div></div>
                    <div className="flex items-center">
                         <img
                          src={task.employee.avatar}
                          alt={task.employee.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="pl-[5px]">
                            <p className="text-[11px] text-[#474747]">   {truncateText(task.department.name)}</p>
                            <p className="text-[#0D0F10] text-sm">{task.employee.name} {task.employee.surname}</p>
                        </div>
                    </div>
                    <div>
                    <div className="text-[#0D0F10] text-sm">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No date"}
                    </div>
                    </div>
                </div>
              </div>

           
            </div>
          </>
        )}
      </div>
    );
};

export default TaskPage;
