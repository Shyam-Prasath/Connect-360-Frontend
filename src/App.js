import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Accepted from "./pages/Accepted";
import Chat from "./pages/Chat";
import DashboardLayout from "./pages/DashboardLayout";
import Home from "./pages/Home";
import Invite from "./pages/Invite";
import Login from "./pages/Login";
import Notice from "./pages/Notice";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import VerifyOtp from "./pages/VerifyOtp";
import VideoCall from "./pages/VideoCall";
import ViewEditProfile from "./pages/ViewEditProfile";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/video-call/:userId" element={<VideoCall />} />
        {isAuthenticated && (
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/invite" element={<Invite />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/accepted" element={<Accepted />} />
            <Route path="/view-profile" element={<ViewEditProfile />} />
            <Route path="/chat/:userId" element={<Chat />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;