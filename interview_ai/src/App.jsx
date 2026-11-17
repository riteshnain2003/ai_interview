import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Details from "./components/Main/Details";
import Interview from "./components/Main/Interview";
import Report from "./components/Main/Report";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import InterviewGuard from "./components/InterviewGuard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="font-serif bg-gradient-to-bl from-[#000000] to-[#414042] min-h-screen text-white overflow-x-hidden">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public only routes - redirect to /Details if already logged in */}
        <Route
          path="/Login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/Signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path="/Details"
          element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <InterviewGuard>
              <Interview />
            </InterviewGuard>
          }
        />
        <Route
          path="/Report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
