import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import EmployeModal from "./EmployeModal";


function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);


  const addEmployeeToList = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    closeModal(); 
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <header className="flex justify-between items-center py-[31px]">
     <Link to="/"><img src={Logo} alt="Logo" className="" /></Link>
      <div className="flex gap-4">
        <button  onClick={openModal} className="border border-[#8338EC] text-[#212529] cursor-pointer rounded-[5px] px-[20px] py-[10px] text-md">
          თანამშრომლის შექმნა
        </button>
        <Link
          to="/new-task"
          className="bg-[#8338EC] hover:bg-[#B588F4] text-white rounded-[5px] px-[20px] py-[10px] text-md flex items-center"
        >
          + შექმენი ახალი დავალება
        </Link>
      </div>
      <EmployeModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onAddEmployee={addEmployeeToList}
      />
    </header>
  );
}

export default Header;
