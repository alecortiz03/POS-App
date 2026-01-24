import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignUp from "./Pages/LoginSignUp/LoginSignUp";
import Dashboard from "./Pages/Dashboard/Dashboard";
import SignUp from "./Pages/SignUp/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
