
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";


  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>
      <form>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold">Title</label>
            <input
             
             
              className="w-full p-2 border rounded"
            />
            
            
          </div>
          <div>
            <label className="block font-semibold">Department</label>
            <select
           
           
              className="w-full p-2 border rounded"
            >
              <option value="">Select Department</option>
             
            </select>
           
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              
              className="w-full p-2 border rounded"
            />
           
          </div>
          <div>
          <label className="block font-semibold">Responsible Employee</label>
         
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Task
        </button>
      </form>
    </div>
  );
;

export default TaskCreationPage;

