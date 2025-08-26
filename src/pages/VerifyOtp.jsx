import { ArrowLeft, CheckCircle, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const email = localStorage.getItem("user-email");
  const navigate = useNavigate();

  // Handle OTP input changes (allow any character)
  const handleOtpChange = (element, index) => {
    const value = element.value; // allow letters, numbers, symbols
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    setOtp(newOtpValues.join(""));

    if (element.nextSibling && value) {
      element.nextSibling.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // Verify OTP
  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/otp/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      if (res.data.user.profileComplete) {
        navigate("/home");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setLoading(true);
    setMsg("");
    try {
      await api.post("/otp/resend-otp", { email });
      setMsg("New OTP sent to your email");
      setOtpValues(new Array(6).fill(""));
      setOtp("");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm">Back</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-300 mb-2">
                We've sent a verification code to
              </p>
              <p className="text-cyan-400 font-medium text-sm bg-white/5 px-3 py-1 rounded-lg inline-block">
                {email}
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={verify} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-200 text-center">
                  Enter 6-character verification code
                </label>

                <div className="flex justify-center space-x-3">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-14 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/20 transition-all duration-300 transform hover:scale-105 uppercase"
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Manual fallback input */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const singleInput = prompt("Enter your 6-character OTP:");
                      if (singleInput && singleInput.length === 6) {
                        setOtp(singleInput);
                        setOtpValues(singleInput.split(""));
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-gray-300 underline transition-colors"
                  >
                    Having trouble? Enter code manually
                  </button>
                </div>
              </div>

              {/* Verify button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={resendOtp}
                disabled={loading}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline decoration-cyan-400/30 hover:decoration-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend Code
              </button>
            </div>

            {/* Status Message */}
            {msg && (
              <div
                className={`mt-6 p-4 rounded-xl border transition-all duration-500 transform ${
                  msg.toLowerCase().includes("invalid") ||
                  msg.toLowerCase().includes("failed")
                    ? "bg-red-500/10 border-red-500/20 text-red-400 animate-shake"
                    : "bg-green-500/10 border-green-500/20 text-green-400 animate-bounce"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {loading ? "Please wait..." : msg}
                  </span>
                </div>
              </div>
            )}

            {/* Security notice */}
            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-1">
                    Security Notice
                  </p>
                  <p className="text-blue-300/80 text-xs leading-relaxed">
                    This code will expire in 10 minutes. Never share your
                    verification code with anyone.
                  </p>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-1 bg-cyan-500 rounded-full"></div>
                <div className="w-8 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                Step 2 of 3
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © Connect 360 2025 All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default VerifyOtp;
