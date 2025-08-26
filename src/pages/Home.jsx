import {
  Activity,
  Award,
  Bell,
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  Clock,
  Globe,
  GraduationCap,
  Mail,
  Settings,
  Target,
  TrendingUp,
  User,
  Users,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        // First check if we have a user in localStorage
        const localUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found in localStorage');
        }

        if (!localUser) {
          throw new Error('No user found in localStorage');
        }

        setUserDetails({
          ...localUser,
          id: localUser._id
        });
    
      } catch (err) {
        console.error("Failed to fetch user details", err);
        setError(err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-violet-50 to-violet-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <div className="text-violet-800 text-xl font-semibold mb-2">Loading user details...</div>
          <div className="text-violet-600">Preparing your personalized experience...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-violet-100">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-red-200 text-center shadow-2xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-red-800 text-xl font-semibold mb-2">Connection Error</div>
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!userDetails) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-violet-50 to-violet-100"><div className="text-violet-800">No user found.</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-violet-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-violet-200/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-96 right-10 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-80 w-80 h-80 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-violet-300/60 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-800 to-purple-600 bg-clip-text text-transparent">
                Connect 360°
              </h1>
              <p className="text-violet-600">User Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-violet-800 font-mono text-xl">{formatTime(currentTime)}</div>
              <div className="text-violet-600 text-sm">{formatDate(currentTime)}</div>
            </div>
            <div className="flex space-x-2">
              <button className="p-3 bg-white/60 backdrop-blur-xl rounded-xl border border-violet-200 hover:bg-white/80 transition-all duration-300 shadow-lg">
                <Bell className="w-5 h-5 text-violet-600" />
              </button>
              <button className="p-3 bg-white/60 backdrop-blur-xl rounded-xl border border-violet-200 hover:bg-white/80 transition-all duration-300 shadow-lg">
                <Settings className="w-5 h-5 text-violet-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-violet-200/50 p-8 mb-8 shadow-2xl">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-1 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-white/30 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-violet-800 mb-2">
                  Welcome, {userDetails.name}
                </h2>
                <p className="text-violet-600 text-lg">
                  Ready to continue your journey? Let's make today productive.
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2 border border-violet-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-600 text-sm">Online</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2 border border-violet-200">
                    <Globe className="w-4 h-4 text-violet-600" />
                    <span className="text-violet-600 text-sm">Global Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-violet-200/50 p-6 hover:bg-white/80 transition-all duration-300 group shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-violet-800 mb-1">42</div>
              <div className="text-green-600 text-sm">Tasks Completed</div>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-violet-200/50 p-6 hover:bg-white/80 transition-all duration-300 group shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-violet-800 mb-1">8</div>
              <div className="text-blue-600 text-sm">Active Projects</div>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-violet-200/50 p-6 hover:bg-white/80 transition-all duration-300 group shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-violet-800 mb-1">94%</div>
              <div className="text-violet-600 text-sm">Success Rate</div>
            </div>

            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-violet-200/50 p-6 hover:bg-white/80 transition-all duration-300 group shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
              <div className="text-2xl font-bold text-violet-800 mb-1">156</div>
              <div className="text-orange-600 text-sm">Team Members</div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-violet-200/50 p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-violet-800 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3" />
                  Profile Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userDetails.role === "student" ? (
                    <>
                      <div className="group">
                        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl border border-violet-200/50 hover:bg-white/70 transition-all duration-300 shadow-lg">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-violet-600 text-sm">🎓 University</div>
                            <div className="text-violet-800 font-semibold">{userDetails.universityName}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group">
                        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl border border-violet-200/50 hover:bg-white/70 transition-all duration-300 shadow-lg">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-violet-600 text-sm">📅 Year</div>
                            <div className="text-violet-800 font-semibold">{userDetails.year}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="group">
                        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl border border-violet-200/50 hover:bg-white/70 transition-all duration-300 shadow-lg">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-violet-600 text-sm">🏢 Company</div>
                            <div className="text-violet-800 font-semibold">{userDetails.companyName}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group">
                        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl border border-violet-200/50 hover:bg-white/70 transition-all duration-300 shadow-lg">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Briefcase className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-violet-600 text-sm">💼 Position</div>
                            <div className="text-violet-800 font-semibold">{userDetails.position}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group">
                        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl border border-violet-200/50 hover:bg-white/70 transition-all duration-300 shadow-lg">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-violet-600 text-sm">⌛ Experience</div>
                            <div className="text-violet-800 font-semibold">{userDetails.yearsOfExperience} years</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-violet-200/50 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-violet-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "Send Message", color: "from-blue-500 to-cyan-500" },
                    { icon: Calendar, label: "Schedule Meeting", color: "from-green-500 to-emerald-500" },
                    { icon: Award, label: "View Achievements", color: "from-violet-500 to-purple-600" }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-violet-200/50 hover:bg-white/70 transition-all duration-300 group shadow-lg"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-violet-800 font-medium">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-violet-600 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-violet-200/50 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-violet-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { time: "2 hours ago", action: "Completed project milestone", color: "bg-green-500" },
                    { time: "5 hours ago", action: "Joined team meeting", color: "bg-blue-500" },
                    { time: "1 day ago", action: "Updated profile information", color: "bg-violet-500" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${activity.color} rounded-full animate-pulse`}></div>
                      <div className="flex-1">
                        <div className="text-violet-800 text-sm">{activity.action}</div>
                        <div className="text-violet-600 text-xs">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 border-t border-violet-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-violet-800 font-semibold">Connect 360°</div>
                <div className="text-violet-600 text-sm">© 2025 All rights reserved</div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-violet-600 text-sm">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;