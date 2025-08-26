import {
  AlertCircle,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  Loader2,
  Mail,
  Send,
  Upload as UploadIcon,
  User,
  Users,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api";

function Invite() {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const email = localUser?.email;

  const [sentInvites, setSentInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(null);

  useEffect(() => {
    if (!localUser?._id || !email) {
      setError("Please login to use invites.");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const sentRes = await api.post("/invites/sent", { userId: localUser._id });
        setSentInvites(sentRes.data);

        const usersRes = await api.post("/invites/users", { userId: localUser._id });
        setUsers(usersRes.data);

        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load invites or users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [localUser?._id, email]);

  const handleInvite = async (user) => {
    try {
      setInviting(user._id);
      await api.post("/invites/send", { fromId: localUser._id, toId: user._id });

      const sentRes = await api.post("/invites/sent", { userId: localUser._id });
      setSentInvites(sentRes.data);

      const usersRes = await api.post("/invites/users", { userId: localUser._id });
      setUsers(usersRes.data);

      setInviting(null);
    } catch (err) {
      console.error("Error sending invite", err);
      setInviting(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-900 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-100 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-yellow-700 font-medium">Loading invites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-100 to-purple-200 relative overflow-hidden">
      {/* Background bubbles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-80 right-20 w-80 h-80 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute -bottom-20 left-60 w-72 h-72 bg-purple-100/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300/40 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-md shadow-md border-b border-purple-200 rounded-xl mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
              <UploadIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent hover:from-yellow-700 hover:to-yellow-500 transition-all duration-500">
                Invitation Center
              </h1>
              <p className="text-sm text-yellow-700 mt-1">Connect with professionals in your network</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/70 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                {localUser?.name?.charAt(0) || "U"}
              </div>
              <span className="font-medium text-yellow-800">{localUser?.name || "User"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Error */}
        {error && (
          <div className="bg-red-100/80 backdrop-blur-xl border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <p className="text-yellow-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sent Invites */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-yellow-200/50 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center">
              <Send className="w-6 h-6 mr-3 text-yellow-600" />
              Invites I've Sent
              <span className="ml-auto text-sm font-normal bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                {sentInvites.length}
              </span>
            </h2>

            {sentInvites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Invites Sent</h3>
                <p className="text-yellow-700">Start connecting with professionals now</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentInvites.map((invite) => (
                  <div
                    key={invite._id}
                    className="bg-white/50 backdrop-blur-xl rounded-2xl border border-yellow-200/50 p-6 hover:bg-white/70 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                          {invite.to?.name ? invite.to.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-yellow-800">
                            {invite.to?.name || invite.to?.email || "Unknown"}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-yellow-700">
                            {invite.to?.position ? (
                              <>
                                <Briefcase className="w-3 h-3" />
                                <span>{invite.to.position}</span>
                              </>
                            ) : (
                              <>
                                <GraduationCap className="w-3 h-3" />
                                <span>Student</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                          invite.status
                        )}`}
                      >
                        {getStatusIcon(invite.status)}
                        <span className="capitalize">{invite.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-yellow-700">
                      {invite.receiver?.companyName && (
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4" />
                          <span>{invite.receiver.companyName}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Sent {new Date(invite.sentAt || invite.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Users to Invite */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-yellow-200/50 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-yellow-600" />
              Available to Invite
              <span className="ml-auto text-sm font-normal bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                {users.length}
              </span>
            </h2>

            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Users Found</h3>
                <p className="text-yellow-700">Check back later for new professionals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => {
                  const alreadyInvited = sentInvites.some((inv) => inv.receiver?.email === user.email);

                  return (
                    <div
                      key={user._id}
                      className="bg-white/50 backdrop-blur-xl rounded-2xl border border-yellow-200/50 p-6 hover:bg-white/70 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                            {(user.name || user.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-yellow-800">{user.name || user.email}</h3>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm text-yellow-700">
                                {user.position ? (
                                  <>
                                    <Briefcase className="w-3 h-3" />
                                    <span>{user.position}</span>
                                  </>
                                ) : (
                                  <>
                                    <GraduationCap className="w-3 h-3" />
                                    <span>Pursuing a Degree</span>
                                  </>
                                )}
                              </div>
                              {user.companyName && (
                                <div className="flex items-center space-x-2 text-sm text-yellow-700">
                                  <Building className="w-3 h-3" />
                                  <span>{user.companyName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleInvite(user)}
                          disabled={alreadyInvited || inviting === user._id}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            alreadyInvited
                              ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                              : inviting === user._id
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                          }`}
                        >
                          {inviting === user._id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Inviting...</span>
                            </>
                          ) : alreadyInvited ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Invited</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Invite</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invite;
