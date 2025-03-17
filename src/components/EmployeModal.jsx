import React, { useState, useEffect } from "react";
import axios from "axios";
import close from "../assets/close.png";
import trash from "../assets/trash.png";

const EmployeModal = ({ isOpen, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const token = "9e6a6811-52b5-49ef-bb0d-19a0903805d5";

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error("Erro:", response.data);
          setDepartments([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setDepartments([]);
      });
  }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  const removeAvatar = (e) => {
    e.stopPropagation();
    setAvatar(null);
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-blur-xs" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}  onClick={onClose}>
      <div className="bg-white rounded-md w-full max-w-md pt-[117px] px-[50px] pb-[60px] relative min-w-[913px]" onClick={(e) => e.stopPropagation()} >
        <button 
          onClick={onClose}
          className="absolute top-[50px] right-[50px] text-gray-500 cursor-pointer"
        >
          <img src={close} alt="close btn" className='w-6 h-6' />
        </button>
        <h2 className="text-[32px] text-[#212529] font-medium mb-[45px] text-center">თანამშრომლის დამატება</h2>
    
        <div className="space-y-4">
          <div className='grid grid-cols-2 gap-[45px]'>
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-[3px]">სახელი*</label>
            <input 
              type="text" 
              className="w-full border  border-gray-300 rounded p-2"
            />
            <div className="flex items-center text-xs text-gray-500 mt-[6px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="#6C757D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

              მინიმუმ 2 სიმბოლო
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-[3px]">გვარი*</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded p-2"
            />
            <div className="flex items-center text-xs text-gray-500 mt-[6px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="#6C757D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

              მინიმუმ 3 სიმბოლო
            </div>
          </div>
          </div>
        
       
          
          <div className='py-[45px]'>
            <label className="block text-sm font-medium text-[#343A40] mb-[3px]">ავატარი*</label>
            <div className="flex flex-col items-center my-4 border border-[#CED4DA] border-dashed rounded-[8px] ">
              {avatar ? (
                <div className="relative py-[16px]">
                  <div className="w-[88px] h-[88px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img 
                      src={avatar} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={removeAvatar} 
                    className="absolute bottom-4 -right-1 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                  >
                   <img src={trash} alt="trash avatar" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer py-[16px]">
                  <div className="w-[88px] h-[88px] rounded-full bg-gray-200 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
              <input 
                type="file" 
                accept="image/*" 
                id="avatar-upload" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          
          
          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-[3px] max-w-[384px]">დეპარტამენტი*</label>
            <div className="relative">
              <select 
                className="w-full border border-gray-300 rounded p-2 pr-8  bg-white max-w-[384px]"
              >
                <option value=""></option>
                {departments.map((dept) => (
                  <option className="" key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        

        <div className="flex justify-between mt-6">
          <button 
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer"
          >
            გაუქმება
          </button>
          <button 
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            დამატება და დამახსოვრება
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeModal;