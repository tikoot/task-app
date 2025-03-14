import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

function Header() {
  return (
    <header className="flex justify-between items-center py-[31px]">
      <img src={Logo} alt="Logo" className="" />
      <div className="flex gap-4">
        <Link to="/new-user" className="border border-[#8338EC] text-[#212529] rounded-[5px] px-[20px] py-[10px] text-md">
          თანამშრომლის შექმნა
        </Link>
        <Link
          to="/new-task"
          className="bg-[#8338EC] text-white rounded-[5px] px-[20px] py-[10px] text-md flex items-center"
        >
          + შექმენი ახალი დავალება
        </Link>
      </div>
    </header>
  );
}

export default Header;
