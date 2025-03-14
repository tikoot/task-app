import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskCreationPage from "./pages/TaskCreationPage";
import TaskList from "./pages/TaskList";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="px-[120px]">
      <Header />
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/new-task" element={<TaskCreationPage />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
