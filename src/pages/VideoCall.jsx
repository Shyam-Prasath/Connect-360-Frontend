import {
  Camera,
  MessageCircle,
  Mic,
  MicOff,
  Monitor,
  Phone,
  VideoOff
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

// init socket
const socket = io("https://connect-360-backend.onrender.com", { transports: ["websocket", "polling"] });

const VideoCall = () => {
  const { userId } = useParams();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [remoteStatus, setRemoteStatus] = useState("Connecting...");
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Stop all media tracks and release camera/mic
  const stopMedia = useCallback(() => {
    // Stop local tracks
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }

    // Stop remote tracks
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    // Close peer connection
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
  }, []);

  // End call and navigate
  const endCall = useCallback(() => {
    stopMedia();
    socket.emit("video-leave", { to: userId });
    navigate("/chat/" + userId, { replace: true });

    // Optional: refresh page to fully release camera/mic in some browsers
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, [navigate, userId, stopMedia]);

  useEffect(() => {
    const ICE_SERVERS = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const startCall = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStatus("Online");
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("video-ice-candidate", { candidate: event.candidate, to: userId });
          }
        };

        const roomId = [localUser._id, userId].sort().join("_");
        socket.emit("joinRoom", roomId);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("video-offer", { offer, to: userId });

        socket.on("video-answer", async ({ answer }) => {
          await pc.setRemoteDescription(answer);
        });

        socket.on("video-ice-candidate", async ({ candidate }) => {
          try {
            await pc.addIceCandidate(candidate);
          } catch (err) {
            console.error("Error adding ICE candidate", err);
          }
        });

        socket.on("video-offer", async ({ offer, from }) => {
          await pc.setRemoteDescription(offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("video-answer", { answer, to: from });
        });

        socket.on("video-leave", () => {
          endCall();
        });

        socket.on("disconnect", () => {
          setRemoteStatus("Offline");
        });

      } catch (err) {
        console.error("Error starting call:", err);
        alert("Cannot access camera/microphone.");
        endCall();
      }
    };

    startCall();

    // Cleanup on unmount
    return () => {
      stopMedia();
    };
  }, [endCall, localUser._id, stopMedia, userId]);

  const toggleMic = () => {
    const audioTrack = localVideoRef.current?.srcObject?.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !micOn;
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    const videoTrack = localVideoRef.current?.srcObject?.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = !cameraOn;
    setCameraOn(!cameraOn);
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-blue-500 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Video Container */}
      <div className={`relative h-full flex transition-all duration-700 ${isMinimized ? 'scale-90 opacity-80' : 'scale-100'}`}>
        {/* Remote Video (Main) */}
        <div className="relative flex-1 group">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            className="w-full h-full object-cover bg-gradient-to-br from-gray-800 to-gray-900"
          />
          
          {/* Remote Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>
          
          {/* Connection Status */}
          <div className="absolute top-6 left-6 z-20">
            <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/20">
              <div className={`w-3 h-3 rounded-full ${remoteStatus === 'Online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-white text-sm font-medium">{remoteStatus}</span>
            </div>
          </div>

          {/* Call Duration */}
          <div className="absolute top-6 right-6 z-20">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/20">
              <span className="text-white text-sm font-mono">{formatDuration(callDuration)}</span>
            </div>
          </div>

          {/* No Video Placeholder */}
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto shadow-2xl">
                  {localUser?.name?.charAt(0) || 'U'}
                </div>
                <p className="text-white text-lg font-medium">Waiting for connection...</p>
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-6 right-6 w-48 sm:w-64 lg:w-80 h-32 sm:h-40 lg:h-48 z-30">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20 group hover:ring-white/40 transition-all duration-300 hover:scale-105">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              className="w-full h-full object-cover bg-gradient-to-br from-gray-700 to-gray-800"
            />
            
            {/* Local Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* You Label */}
            <div className="absolute bottom-2 left-2">
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                You
              </span>
            </div>

            {/* Camera Off Overlay */}
            {!cameraOn && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2 mx-auto">
                    {localUser?.name?.charAt(0) || 'U'}
                  </div>
                  <p className="text-white text-xs">Camera off</p>
                </div>
              </div>
            )}

            {/* Minimize Toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
            >
              {isMinimized ? '📺' : '📱'}
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className={`absolute bottom-0 left-0 right-0 z-40 transition-all duration-500 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="bg-black/40 backdrop-blur-2xl border-t border-white/10">
          <div className="flex items-center justify-center py-6 px-8">
            <div className="flex items-center space-x-4 sm:space-x-6">
              
              {/* Microphone Toggle */}
              <button
                onClick={toggleMic}
                className={`relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  micOn 
                    ? 'bg-white/20 hover:bg-white/30 text-white shadow-lg' 
                    : 'bg-red-500/80 hover:bg-red-600 text-white shadow-red-500/50'
                } shadow-xl backdrop-blur-sm border border-white/20`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {micOn ? 'Mute' : 'Unmute'}
                </span>
              </button>

              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                className={`relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  cameraOn 
                    ? 'bg-white/20 hover:bg-white/30 text-white shadow-lg' 
                    : 'bg-red-500/80 hover:bg-red-600 text-white shadow-red-500/50'
                } shadow-xl backdrop-blur-sm border border-white/20`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {cameraOn ? <Camera size={20} /> : <VideoOff size={20} />}
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {cameraOn ? 'Turn off camera' : 'Turn on camera'}
                </span>
              </button>

              {/* Screen Share Button */}
              <button className="relative p-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all duration-300 transform hover:scale-110 shadow-xl backdrop-blur-sm border border-white/20">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Monitor size={20} />
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Share screen
                </span>
              </button>

              {/* Chat Button */}
              <button 
                onClick={() => navigate(`/chat/${userId}`)}
                className="relative p-4 rounded-2xl bg-blue-500/80 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-110 shadow-xl shadow-blue-500/30 backdrop-blur-sm border border-white/20"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Open chat
                </span>
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="relative p-4 rounded-2xl bg-red-500/80 hover:bg-red-600 text-white transition-all duration-300 transform hover:scale-110 shadow-xl shadow-red-500/50 backdrop-blur-sm border border-red-300/20 ml-4"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  End call
                </span>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Participants Info */}
      <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20">
        <div className={`bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 transition-all duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {localUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{localUser?.name || 'You'}</p>
                <p className="text-green-400 text-xs">Connected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                U
              </div>
              <div>
                <p className="text-white text-sm font-medium">Remote User</p>
                <p className={`text-xs ${remoteStatus === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
                  {remoteStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .animate-ripple {
          animation: ripple 0.6s linear;
        }

        @media (max-width: 640px) {
          .absolute.bottom-6.right-6 {
            bottom: 5rem;
            right: 1rem;
            width: 120px;
            height: 80px;
          }
          
          .flex.items-center.space-x-4 {
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          
          .py-6.px-8 {
            padding: 1rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoCall;