import React from 'react';
import close from "../assets/close.png";

const EmployeModal = ({ isOpen, onClose }) => {
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
        
       
          
    
          <div>
            <label className="block text-sm mb-1">ავატარი*</label>
            <div className="flex justify-center my-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <img 
                  src="" 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          
          <div>
            <label className="block text-sm mb-1">დეპარტამენტი*</label>
            <div className="relative">
              <select 
                className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none bg-white"
              >
                <option></option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
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