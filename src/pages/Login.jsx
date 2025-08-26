// must contain the Tailwind directives
import { Lock, Mail, Shield, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import useMetaMask from '../hooks/useMetaMask';
import '../index.css'; // adjust path based on your folder structure

function Login() {
  const { account, error, connectWallet } = useMetaMask();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      if (!account) {
        throw new Error('Please connect your wallet first');
      }
      if (!email) {
        throw new Error('Please enter your email');
      }

      const response = await api.post('/auth/authenticate', {
        walletAddress: account.toLowerCase(),
        email: email.trim().toLowerCase()
      });
      localStorage.setItem('user-email', email.trim().toLowerCase());

      if (response.data.temp) {
        setMsg('OTP sent to your email. Please verify.');
        setTimeout(() => navigate('/verify-otp'), 1000);
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message || 'Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome To Connect360 °</h1>
              <p className="text-gray-300">Connect your wallet to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Wallet Connection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">Wallet Address</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Connect your wallet" 
                    value={account || ''} 
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={connectWallet}
                  className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Connect MetaMask Wallet</span>
                </button>
              </div>

              {/* Email Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                disabled={loading || !account}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors underline decoration-cyan-400/30 hover:decoration-cyan-300">
                  Register here
                </Link>
              </p>
            </div>

            {/* Status Message */}
            {(error || msg) && (
              <div className={`mt-6 p-4 rounded-xl border ${
                msg.includes('success') || msg.includes('OTP sent') 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              } transition-all duration-300`}>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {error || (loading ? 'Please wait...' : msg)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © Connect 360 2025 All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;