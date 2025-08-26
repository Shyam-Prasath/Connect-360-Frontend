import axios from "axios";
import {
    Building2,
    Clock,
    Heart,
    Mail,
    Star,
    User,
    UserCheck,
    UserPlus,
    Users
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Accepted = () => {
    const [acceptedUsers, setAcceptedUsers] = useState([]);
    const [incomingInvites, setIncomingInvites] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("connected");
    const [processingInvites, setProcessingInvites] = useState({});
    const navigate = useNavigate();
    
    const localUser = JSON.parse(localStorage.getItem("user"));
    const userId = localUser?._id;

    const fetchData = useCallback(async () => {
        if (!userId) return;

        try {
            const sentRes = await axios.post("http://localhost:5000/api/invites/sent", { userId });
            const acceptedSent = sentRes.data
                .filter(inv => inv.status === "accepted")
                .map(inv => ({ ...inv.to, inviteId: inv._id }));

            const receivedRes = await axios.post("http://localhost:5000/api/invites/received", { userId });
            const acceptedReceived = receivedRes.data
                .filter(inv => inv.status === "accepted")
                .map(inv => ({ ...inv.from, inviteId: inv._id }));

            const pendingInvites = receivedRes.data
                .filter(inv => inv.status === "pending")
                .map(inv => ({ ...inv.from, inviteId: inv._id }));

            const merged = [...acceptedSent, ...acceptedReceived];
            const uniqueAccepted = Array.from(new Map(merged.map(user => [user._id, user])).values());

            setAcceptedUsers(uniqueAccepted);
            setIncomingInvites(pendingInvites);
        } catch (err) {
            console.error("Error loading data", err);
        }
    }, [userId]);

    useEffect(() => {
        setIsVisible(true);
        fetchData();
    }, [fetchData]);

    const handleAccept = async (inviteId) => {
        setProcessingInvites(prev => ({ ...prev, [inviteId]: 'accepting' }));
        try {
            await axios.post("http://localhost:5000/api/invites/accept", { inviteId });
            await fetchData();
        } catch (err) {
            console.error("Error accepting invite", err);
        } finally {
            setProcessingInvites(prev => ({ ...prev, [inviteId]: null }));
        }
    };

    const handleIgnore = async (inviteId) => {
        setProcessingInvites(prev => ({ ...prev, [inviteId]: 'ignoring' }));
        try {
            await axios.delete("http://localhost:5000/api/invites/ignore", { data: { inviteId } });
            await fetchData();
        } catch (err) {
            console.error("Error ignoring invite", err);
        } finally {
            setProcessingInvites(prev => ({ ...prev, [inviteId]: null }));
        }
    };

    const filteredAccepted = acceptedUsers.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMessageClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
                <div className="absolute top-40 left-40 w-60 h-60 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-500"></div>

                <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float opacity-40"></div>
                <div className="absolute top-40 right-1/3 w-3 h-3 bg-purple-300 rounded-full animate-float-delayed opacity-30"></div>
                <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-pink-300 rounded-full animate-float-slow opacity-40"></div>
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-indigo-300 rounded-full animate-float opacity-50"></div>
            </div>

            {/* Header */}
            <header className={`relative bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:rotate-12 group">
                            <Users className="h-8 w-8 text-white group-hover:animate-wiggle" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hover:from-green-600 hover:to-emerald-600 transition-all duration-500">
                                My Network
                            </h1>
                            <p className="text-sm text-gray-500 animate-fade-in-up">Manage your professional connections</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white/70 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {localUser?.name?.charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-green-800">{localUser?.name || "User"}</span>
                    </div>
                </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search connections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                <div className="mb-8 flex space-x-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-white/20 inline-flex">
                    <button
                        onClick={() => setActiveTab("connected")}
                        className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 ${
                            activeTab === "connected"
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105"
                                : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                        }`}
                    >
                        <UserCheck className="h-5 w-5" />
                        <span>Connected ({acceptedUsers.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 ${
                            activeTab === "requests"
                                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg transform scale-105"
                                : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        }`}
                    >
                        <Clock className="h-5 w-5" />
                        <span>Requests ({incomingInvites.length})</span>
                        {incomingInvites.length > 0 && (
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                        )}
                    </button>
                </div>

                {/* Connected Users */}
                {activeTab === "connected" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAccepted.length === 0 ? (
                            <div className="text-center py-16 animate-fade-in">
                                <Users className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
                                <h4 className="text-xl font-semibold text-gray-600 mt-4">No connections yet</h4>
                                <p className="text-gray-500">Start building your professional network!</p>
                            </div>
                        ) : filteredAccepted.map((user, idx) => (
                            <div
                                key={idx}
                                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-emerald-400/0 to-blue-400/0 group-hover:from-green-400/10 group-hover:via-emerald-400/10 group-hover:to-blue-400/10 transition-all duration-500 rounded-2xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600">{user.name}</h3>
                                            <div className="flex items-center space-x-1 text-sm text-gray-500 group-hover:text-green-500">
                                                <User className="h-3 w-3" />
                                                <span>{user.position || "Professional"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        {user.email && <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-gray-800"><Mail className="h-4 w-4 text-blue-500" /><span>{user.email}</span></div>}
                                        {user.collegeOrCompany && <div className="flex items-center space-x-2 text-sm text-gray-600 group-hover:text-gray-800"><Building2 className="h-4 w-4 text-purple-500" /><span>{user.collegeOrCompany}</span></div>}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => handleMessageClick(user._id)} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105">Message</button>
                                        <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
                                        <Star className="h-5 w-5 text-gray-500 hover:text-yellow-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Incoming Requests */}
                {activeTab === "requests" && (
                    <div className="space-y-6">
                        {incomingInvites.length === 0 ? (
                            <div className="text-center py-16">
                                <UserPlus className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
                                <h4 className="text-xl font-semibold text-gray-600 mt-4">No pending requests</h4>
                                <p className="text-gray-500">All caught up!</p>
                            </div>
                        ) : incomingInvites.map((user, idx) => (
                            <div key={idx} className="bg-white/90 rounded-2xl p-6 border border-orange-200 shadow-lg flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">{user.name}</h3>
                                    <p className="text-sm text-gray-500">{user.position}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleAccept(user.inviteId)}
                                        disabled={processingInvites[user.inviteId] === "accepting"}
                                        className={`px-4 py-2 rounded-xl text-white ${
                                            processingInvites[user.inviteId] === "accepting"
                                            ? "bg-green-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                        }`}
                                        >
                                        {processingInvites[user.inviteId] === "accepting" ? "Accepting..." : "Accept"}
                                    </button>
                                    <button
                                        onClick={() => handleIgnore(user.inviteId)}
                                        disabled={processingInvites[user.inviteId] === "ignoring"}
                                        className={`px-4 py-2 rounded-xl text-white ${
                                            processingInvites[user.inviteId] === "ignoring"
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                        }`}
                                        >
                                        {processingInvites[user.inviteId] === "ignoring" ? "Ignoring..." : "Ignore"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

        </div>
    );
};

export default Accepted;
