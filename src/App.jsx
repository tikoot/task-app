import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskCreationPage from "./pages/TaskCreationPage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/new-task">New Task</Link>
      </nav>
      <Routes>
        <Route path="/new-task" element={<TaskCreationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
