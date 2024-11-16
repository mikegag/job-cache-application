import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Job from "./pages/Job";
import AddNewJob from "./pages/AddNewJob";
import ViewJobDetails from "./pages/ViewJobDetails";
import Motivate from "./pages/Motivate";
import ProtectedRoute from "./components/ProtectedRoute";
import Error from "./components/Error";
import { BrowserRouter, Routes, Route} from "react-router-dom";

export default function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="logout" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="job" element={<ProtectedRoute />}>
            <Route index element={<Job />} />
            <Route path="newJob" element={<AddNewJob />} />
            <Route path=":id" element={<ViewJobDetails />} />
            <Route path="motivate" element={<Motivate/>} /> 
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
