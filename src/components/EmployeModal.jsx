import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import close from "../assets/close.png";
import trash from "../assets/trash.png";

const EmployeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [departments, setDepartments] = useState([]);
  const token = "9e76e164-1b7c-49c4-a4f5-7376c746103f";
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setDepartments(response.data || []))
      .catch((error) => console.error("Error:", error));
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file); 
      setValue("avatar", file);
    }
  };


  const removeAvatar = () => {
    setAvatar(null);
    setAvatarFile(null);
    setValue("avatar", null); 
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("surname", data.surname);
      formData.append("department_id", data.departmentId);
      formData.append("avatar", data.avatarFile);

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

      reset(); 

      onClose(); 
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-[45px]">
            <div>
              <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
                სახელი*
              </label>
              <input
                {...register("name", {
                  required: "სახელი სავალდებულოა",
                  minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                  maxLength: { value: 255, message: "მაქსიმუმ 255 სიმბოლო" },
                  pattern: {
                    value: /^[ა-ჰa-zA-Z]+$/, 
                    message: "სახელი უნდა შეიცავდეს მხოლოდ ქართულ და ინგლისურ სიმბოლოებს",
                  },
                })}
                type="text"
                className="w-full border border-gray-300 rounded p-2 "
              />
              <p
                className={`text-[10px] ${
                  errors.name
                    ? "text-red-500"
                    : watch("name") && watch("name").length >= 2 && watch('name').length <=2
                    ? "text-[#08A508]"
                    : "text-[#6C757D]"
                }`}
              > სავალდებულო <br />
                მინიმუმ 2 სიმბოლო
                <br />
                მაქსიმუმ 255 სიმბოლო
                <br />
                სახელი უნდა შეიცავდეს მხოლოდ ქართულ და ინგლისურ სიმბოლოებს
              </p>
             
            </div>

            <div>
              <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
                გვარი*
              </label>
              <input
                {...register("surname", {
                  required: "გვარი სავალდებულოა",
                  minLength: { value: 2, message: "გვარი უნდა იყოს მინიმუმ 2 სიმბოლო" },
                  maxLength: { value: 255, message: "გვარი უნდა იყოს მაქსიმუმ 255 სიმბოლო" },
                  pattern: {
                    value: /^[ა-ჰa-zA-Z]+$/, 
                    message: "გვარი უნდა შეიცავდეს მხოლოდ ქართულ და ინგლისურ სიმბოლოებს",
                  },
                })}
                type="text"
                className="w-full border border-gray-300 rounded p-2"
              />
               <p
                className={`text-[10px] ${
                  errors.surname
                    ? "text-red-500"
                    : watch("surname") && watch("surname").length >= 2
                    ? "text-[#08A508]"
                    : "text-[#6C757D]"
                }`}
              > სავალდებულო <br />
                მინიმუმ 2 სიმბოლო
                <br />
                მაქსიმუმ 255 სიმბოლო
                <br />
                გვარი უნდა შეიცავდეს მხოლოდ ქართულ და ინგლისურ სიმბოლოებს
              </p>
            </div>
          </div>

          <div className="py-[45px]">
        <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
          ავატარი*
        </label>
        <div className="flex flex-col items-center my-4 border border-[#CED4DA] border-dashed rounded-[8px]">
          {errors.avatar && (
            <p className="text-red-500 text-xs">
              {errors.avatar.message} {/* Show error message */}
            </p>
          )}
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
                {...register("avatar", {
                  required: "ავატარი სავალდებულოა",
                  validate: {
                    lessThanSize: (file) => {
                      return file && file.size <= 600000 || "ფაილი უნდა იყოს მაქსიმუმ 600KB";
                    },
                    isImage: (file) => {
                      return file && file.type.startsWith("image/") || "ფაილი უნდა იყოს სურათის ტიპის";
                    },
                  },
                })}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>
        <p
          className={`text-[10px] ${
            errors.avatar
              ? "text-red-500" 
              : watch("avatar")
              ? "text-[#08A508]" 
              : "text-[#6C757D]" 
          }`}
        >
            მაქსიმუმ 600kb ზომაში
          <br />
           უნდა იყოს სურათის ტიპის
        </p>
      </div>

          <div>
            <label className="block text-sm font-medium text-[#343A40] mb-[3px]">
              დეპარტამენტი*
            </label>
            <select
              {...register("departmentId", { required: "დეპარტამენტი სავალდებულოა" })}
              className="w-full border border-gray-300 rounded p-2 pr-8 bg-white max-w-[384px]"
            >
              <option value=""></option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <p className="text-red-500 text-xs">{errors.departmentId.message}</p>}
          </div>

          <div className="flex justify-end mt-[65px]">
            <button
              onClick={onClose}
              className="border border-[#8338EC] text-gray-700 px-4 py-2 rounded cursor-pointer mr-[22px]"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="bg-[#8338EC] text-white px-6 py-2 rounded hover:bg-[#B588F4]"
            >
              დაამატე თანამშრომელი
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeModal;
