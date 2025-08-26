import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaMicrophone, FaPaperPlane, FaPhone, FaSmile, FaVideo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

const Chat = () => {
  const { userId } = useParams();
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [otherUser, setOtherUser] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const messagesEndRef = useRef();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", localUser._id);
    formData.append("receiver", userId);

    try {
      const res = await fetch("http://localhost:5000/api/messages/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");

      await res.json();
      setFile(null);
    } catch (err) {
      console.error("File upload error:", err);
      alert("Failed to upload file");
    }
  };

  // Fetch other user's info
  useEffect(() => {
    if (!userId) return;
    const fetchOtherUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/id/${userId}`);
        const data = await res.json();
        setOtherUser(data);
      } catch (err) {
        console.error("Error fetching other user:", err);
      }
    };
    fetchOtherUser();
  }, [userId]);

  // Fetch previous conversation
  useEffect(() => {
    if (!localUser?._id || !userId) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${localUser._id}/${userId}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchHistory();
  }, [localUser?._id, userId]);

  // Socket.io setup
  useEffect(() => {
    if (!localUser?._id || !userId) return;

    const roomId = [localUser._id, userId].sort().join("_");
    socket.emit("joinRoom", roomId);

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.emit("leaveRoom", roomId);
    };
  }, [localUser?._id, userId]);

  // Auto-scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing simulation
  useEffect(() => {
    if (newMsg.trim()) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newMsg]);

  // Send message
  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const msgData = {
      sender: localUser._id,
      receiver: userId,
      text: newMsg,
      senderName: localUser?.name,
    };

    try {
      const response = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to save message");
      }

      await response.json();
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert(err.message || "Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  };

  const emojis = ["😊", "😂", "❤️", "👍", "👎", "😢", "😮", "😡"];

  return (
    <div 
      className="flex flex-col h-screen relative overflow-hidden bg-gradient-to-br from-white via-violet-100 to-purple-200"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-300 rounded-full opacity-30 animate-pulse blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000 blur-2xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-violet-400 rounded-full opacity-20 animate-pulse delay-2000 blur-3xl"></div>
        <div className="absolute top-20 left-1/2 w-48 h-48 bg-fuchsia-300 rounded-full opacity-20 animate-pulse delay-3000 blur-2xl"></div>
      </div>

      {/* Drag Overlay */}
      {dragActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-600/80 flex items-center justify-center z-50 backdrop-blur-lg">
          <div className="text-white text-center">
            <div className="text-7xl mb-6 animate-bounce">📁</div>
            <div className="text-3xl font-bold mb-2 tracking-wide">Drop your file here</div>
            <div className="text-xl opacity-90">Release to upload</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-xl ring-4 ring-white/20">
                {otherUser?.name?.charAt(0) || "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-black tracking-tight">
                {otherUser?.name || "User"}
              </h2>
              <p className="text-xs sm:text-sm text-green-400 font-medium flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:rotate-12">
              <FaPhone className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => window.open(`/video-call/${userId}`, "_blank")}
              className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:rotate-12"
            >
              <FaVideo className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button className="p-2 sm:p-3 bg-gradient-to-br from-white-500 to-white-700 rounded-full hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:rotate-12">
              <FaEllipsisV className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
            </button>

          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 relative z-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
        {messages.map((m, i) => {
          const isMine = m.senderName === localUser?.name;
          const displayName = isMine ? localUser?.name : m.senderName || "Unknown";

          return (
            <div
              key={i}
              className={`flex items-end space-x-2 transition-all duration-500 transform ${
                isMine ? "justify-end" : "justify-start"
              }`}
              style={{
                animation: `slideInMessage 0.6s ease-out ${i * 0.1}s both`,
              }}
            >
              {!isMine && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg ring-2 ring-white/20 flex-shrink-0">
                  {displayName.charAt(0)}
                </div>
              )}
              
              <div className={`max-w-[75%] sm:max-w-xs lg:max-w-md ${isMine ? "order-1" : ""}`}>
                <div
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.02] ${
                    isMine
                      ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-br-sm shadow-blue-500/25"
                      : "bg-white/90 text-gray-800 rounded-bl-sm border border-white/40 shadow-white/25"
                  }`}
                >
                  <div className={`text-xs font-medium mb-1 ${isMine ? "text-blue-100" : "text-gray-500"}`}>
                    {displayName}
                  </div>
                  
                  {m.text && (
                    <p className="text-sm sm:text-base leading-relaxed break-words">{m.text}</p>
                  )}
                  
                  {m.fileUrl && (
                    <div className="mt-2">
                      <a
                        href={`http://localhost:5000${m.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-105 ${
                          isMine
                            ? "bg-white/20 hover:bg-white/30 text-white shadow-lg"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md"
                        }`}
                      >
                        <span> <Upload className="w-4 h-4 sm:w-5 sm:h-5" /> </span>
                        <span className="truncate max-w-32">{m.fileName || "Download file"}</span>
                      </a>
                    </div>
                  )}
                  
                  <div className={`text-xs opacity-70 mt-2 ${isMine ? "text-right" : "text-left"}`}>
                    {formatTime(m.createdAt)}
                  </div>
                </div>
              </div>

              {isMine && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg ring-2 ring-white/20 flex-shrink-0">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
              {otherUser?.name?.charAt(0) || "U"}
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-sm shadow-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {file && (
        <div className="mx-3 sm:mx-6 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 animate-slideUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                📄
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white truncate text-sm sm:text-base">{file.name}</div>
                <div className="text-xs sm:text-sm text-purple-200">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={uploadFile}
                className="px-3 sm:px-4 py-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-xs sm:text-sm font-medium"
              >
                Upload
              </button>
              <button
                onClick={() => setFile(null)}
                className="p-2 text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-full"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mx-3 sm:mx-6 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 animate-slideUp">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {emojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => {
                  setNewMsg(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-xl sm:text-2xl p-2 hover:bg-white/20 rounded-xl transition-all duration-200 transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-6 bg-white/10 backdrop-blur-xl border-t border-white/20">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-3 bg-gradient-to-br from-sky-400 to-cyan-500 text-white rounded-full hover:shadow-lg transform hover:scale-110 transition-all duration-200 hover:rotate-12"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 sm:p-3 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-full hover:shadow-lg transform hover:scale-110 transition-all duration-200 hover:rotate-12"
          >
            <FaSmile className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <div className="flex-1 relative">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full 
                          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 
                          transition-all duration-300 text-black placeholder-black text-sm sm:text-base"
              />
          </div>


          <button
            className="p-2 sm:p-3 bg-gradient-to-br from-teal-400 to-emerald-500 text-white rounded-full hover:shadow-lg transform hover:scale-110 transition-all duration-200 hover:rotate-12"
          >
            <FaMicrophone className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={sendMessage}
            disabled={!newMsg.trim()}
            className="p-2 sm:p-3 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 hover:rotate-12"
          >
            <FaPaperPlane className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInMessage {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thumb-white 20::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .scrollbar-thumb-white 20::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 640px) {
          .animate-slideInMessage {
            animation-duration: 0.4s;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;