import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Frame2 from "../assets/Frame2.png";
import piechart from "../assets/piechart.png";
import calendar from "../assets/calendar.png";

const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const token = "9e6a6811-52b5-49ef-bb0d-19a0903805d5";

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `https://momentum.redberryinternship.ge/api/tasks/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTask(response.data);
        setSelectedStatus(response.data.status.id);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await axios.get(
          "https://momentum.redberryinternship.ge/api/statuses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchTask();
    fetchStatuses();
    fetchComments();
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatusId = event.target.value;
    setSelectedStatus(newStatusId);

    try {
      await axios.put(
        `https://momentum.redberryinternship.ge/api/tasks/${id}`,
        { status_id: newStatusId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, { ...response.data, reply: null }]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!newReply.trim()) return;

    try {
      const response = await axios.post(
        `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
        { text: newReply, parent_id: parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? { ...comment, reply: response.data }
            : comment
        )
      );
      setNewReply("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

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
    },
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
                <div className={`${getDepartmentColor(task.department?.id)} px-[18px] py-[5px] text-white rounded-[15px] text-xs}`}>
                  {truncateText(task.department?.name || "", 12)}
                </div>
              </div>
            </div>

            <h1 className="text-[34px] font-bold mb-[36px] text-[#212529]">{task.name}</h1>

            <p className="text-gray-700 mb-[63px] text-[18px]">{task.description}</p>

            <h2 className="font-bold text-[24px] text-[#2A2A2A] mb-[28px]">დავალების დეტალები</h2>

            <div className="grid grid-cols-1 gap-[45px]">
              <div className="grid grid-cols-2 gap-[70px]">
                <div className="flex items-center">
                  <img src={piechart} alt="" />
                  <p className="pl-[6px] text-[#474747] text-md">სტატუსი</p>
                </div>

                <div className="">
                  <div className="mt-4">
                    <select
                      id="status"
                      name="status"
                      value={selectedStatus || ""}
                      onChange={handleStatusChange}
                      className="w-[259px] bg-white border border-[#DEE2E6] rounded-[5px] p-2 text-[#0D0F10]"
                    >
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[70px]">
                <div className="flex items-center">
                  <img src={Frame2} alt="" />
                  <p className="pl-[6px] text-[#474747] text-md">თანამშრომელი</p>
                </div>
                <div className="flex items-center">
                  <img
                    src={task.employee.avatar}
                    alt={task.employee.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="pl-[5px]">
                    <p className="text-[11px] text-[#474747]">{truncateText(task.department.name)}</p>
                    <p className="text-[#0D0F10] text-sm">{task.employee.name} {task.employee.surname}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[70px]">
                <div className="flex items-center">
                  <img src={calendar} alt="" />
                  <p className="pl-[6px] text-[#474747] text-md">დავალების ვადა</p>
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
      <div className="comments border border-[#DDD2FF]  bg-[#F8F3FEA6] rounded-[10px]">
        <div className="px-[45px] py-[40px]">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border rounded-[10px] border-[#ADB5BD] bg-white px-[20px] pt-[18px] resize-none min-h-[135px] mt-4 text-[#898989] text-sm"
            placeholder="დაწერე კომენტარი"
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-2 bg-[#8338EC] text-white px-[18px] py-2 rounded-[20px] disabled:opacity-50"
          >
            დააკომენტარე
          </button>

          <div className="mt-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 mt-4">
                <p className="font-semibold">{comment.author_nickname}</p>
                <p>{comment.text}</p>

                {!comment.reply && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-blue-500 mt-2"
                  >
                    Reply
                  </button>
                )}

                {replyingTo === comment.id && (
                  <div className="mt-2">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="w-full border p-2"
                      placeholder="Write a reply..."
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      Submit Reply
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="ml-2 text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {comment.reply && (
                  <div className="ml-4 border-l pl-4 mt-2">
                    <div>
                      <img className="w-8 h-8 rounded-full mr-2" src={comment.reply.author_avatar} alt="" />
                      {comment.reply.author_nickname}
                      <p>{comment.reply.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
