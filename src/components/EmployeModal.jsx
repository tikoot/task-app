import React, { useState, useEffect } from "react";
import axios from "axios";
import close from "../assets/close.png";
import trash from "../assets/trash.png";

const EmployeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const token = "9e76e164-1b7c-49c4-a4f5-7376c746103f";

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setDepartments(response.data || []))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const removeAvatar = (e) => {
    e.stopPropagation();
    setAvatar(null);
    setAvatarFile(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("department_id", departmentId);
      formData.append("avatar", avatarFile);

      const response = await axios.post(
        "https://momentum.redberryinternship.ge/api/employees",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newEmployee = response.data;
      onAddEmployee(newEmployee); 

      setName("");
      setSurname("");
      setDepartmentId("");
      setAvatar(null);
      setAvatarFile(null);
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;


  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md w-full max-w-md pt-[117px] px-[50px] pb-[60px] relative min-w-[913px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[50px] right-[50px] text-gray-500 cursor-pointer"
        >
          <img src={close} alt="close btn" className="w-6 h-6" />
        </button>
        <h2 className="text-[32px] text-[#212529] font-medium mb-[45px] text-center">
          თანამშრომლის დამატება
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-[45px]">
            <div>
              <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
                სახელი*
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
                გვარი*
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>

          <div className="py-[45px]">
            <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
              ავატარი*
            </label>
            <div className="flex flex-col items-center my-4 border border-[#CED4DA] border-dashed rounded-[8px]">
              {avatar ? (
                <div className="relative py-[16px]">
                  <div className="w-[88px] h-[88px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="#6C757D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
              დეპარტამენტი*
            </label>
            <select
              className="w-full border border-gray-300 rounded p-2 pr-8 bg-white max-w-[384px]"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value=""></option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-[65px]">
          <button
            onClick={onClose}
          className="border border-[#8338EC] text-gray-700 px-4 py-2 rounded cursor-pointer mr-[22px]"
          >
            გაუქმება
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#8338EC] text-white px-6 py-2 rounded hover:bg-[#B588F4]"
           
          >
           დაამატე თანამშრომელი
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeModal;
