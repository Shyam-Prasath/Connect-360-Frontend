import {
  Bell,
  Bookmark,
  Clock,
  Heart,
  MessageSquare,
  Send,
  Share2,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";

function Notice() {
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [likedNotices, setLikedNotices] = useState({});
  const [savedNotices, setSavedNotices] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const localUser = JSON.parse(localStorage.getItem("user"));
  const email = localUser?.email;

  useEffect(() => {
    setIsVisible(true);
    async function fetchNotices() {
      try {
        const res = await api.get("/notices");
        setNotices(res.data);
      } catch (err) {
        setError("Failed to load notices");
      }
    }
    fetchNotices();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!message) return setError("Please enter a message");

    setIsPosting(true);
    try {
      const res = await api.post("/notices", { message, email });
      setNotices([res.data.notice, ...notices]);
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Error posting notice");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCommentChange = (noticeId, value) => {
    setCommentInputs((prev) => ({ ...prev, [noticeId]: value }));
  };

  const handleCommentSubmit = async (e, noticeId) => {
    e.preventDefault();
    const commentMsg = commentInputs[noticeId];
    if (!commentMsg) {
      setError("Please enter a comment");
      return;
    }

    try {
      const res = await api.post(`/notices/${noticeId}/comments`, {
        message: commentMsg,
        email,
      });

      setNotices((prevNotices) =>
        prevNotices.map((notice) =>
          notice._id === noticeId
            ? { ...notice, comments: res.data.comments }
            : notice
        )
      );

      setCommentInputs((prev) => ({ ...prev, [noticeId]: "" }));
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Error posting comment");
    }
  };

  const handleLike = (noticeId) => {
    setLikedNotices((prev) => ({
      ...prev,
      [noticeId]: !prev[noticeId],
    }));
  };

  const handleSave = (noticeId) => {
    setSavedNotices((prev) => ({
      ...prev,
      [noticeId]: !prev[noticeId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-100 to-red-200 relative overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-red-400 to-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-rotate-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-rotate-slower"></div>
      </div>

      {/* Header */}
      <header
        className={`relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/30 transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-600 to-red-500 rounded-xl shadow-lg hover:scale-110 transform transition-all duration-300 animate-bounce-slow">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hover:from-red-600 hover:to-red-500 transition-all duration-500">
                Notice Board
              </h1>
              <p className="text-sm text-gray-500 animate-fade-in-up">
                Stay connected, stay informed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/70 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                {localUser?.name?.charAt(0) || "U"}
              </div>
              <span className="font-medium text-red-800">{localUser?.name || "User"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Post Notice */}
        <form
          onSubmit={handlePost}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-6 mb-8 hover:shadow-2xl transition-all duration-500"
        >
          <textarea
            className="w-full border border-gray-200 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-red-400 focus:outline-none resize-none"
            rows="3"
            placeholder="✨ Share something important..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={isPosting}
            className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4 animate-bounce-x" />
            <span>{isPosting ? "Posting..." : "Post Notice"}</span>
          </button>
        </form>

        {/* Notices Feed */}
        <div className="space-y-8">
          {notices.length === 0 && (
            <p className="text-gray-500 text-center">No notices yet.</p>
          )}
          {notices.map((notice, index) => (
            <div
              key={notice._id}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-white/30 p-6 transform hover:-translate-y-1 hover:rotate-1 hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-gray-800 text-lg mb-2">{notice.message}</p>
              <div className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-3">
                <User className="h-4 w-4" />
                <span>{notice.name || "Unknown"}</span>
                <span>• {notice.position || "Student"}</span>
                <span>• {notice.collegeOrCompany || "N/A"}</span>
                <Clock className="h-4 w-4" />
                <span>{new Date(notice.timestamp).toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-6 mb-4">
                <button
                  onClick={() => handleLike(notice._id)}
                  className={`flex items-center space-x-1 transition transform ${
                    likedNotices[notice._id]
                      ? "text-red-500 scale-110"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition ${
                      likedNotices[notice._id] ? "fill-current animate-ping" : ""
                    }`}
                  />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => handleSave(notice._id)}
                  className={`flex items-center space-x-1 transition transform ${
                    savedNotices[notice._id]
                      ? "text-red-500 scale-110"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Bookmark
                    className={`h-5 w-5 transition ${
                      savedNotices[notice._id]
                        ? "fill-current animate-bounce"
                        : ""
                    }`}
                  />
                  <span>Save</span>
                </button>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  Comments
                </h4>
                {notice.comments && notice.comments.length > 0 ? (
                  <ul className="space-y-2">
                    {notice.comments.map((comment, idx) => (
                      <li
                        key={idx}
                        className="border-t border-gray-200 pt-2 text-sm text-gray-700 animate-fade-in"
                      >
                        <b>{comment.name || "Anonymous"}:</b> {comment.message}
                        <br />
                        <small className="text-gray-400">
                          {new Date(comment.timestamp).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No comments yet.</p>
                )}

                {/* Add comment form */}
                <form
                  onSubmit={(e) => handleCommentSubmit(e, notice._id)}
                  className="mt-3 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    placeholder="💬 Add a comment..."
                    value={commentInputs[notice._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(notice._id, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Custom animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes rotateSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite;
        }
        .animate-rotate-slow {
          animation: rotateSlow 30s linear infinite;
        }
        .animate-rotate-slower {
          animation: rotateSlow 60s linear infinite;
        }
        @keyframes bounceX {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        .animate-bounce-x {
          animation: bounceX 1s infinite;
        }
      `}</style>
    </div>
  );
}

export default Notice;
