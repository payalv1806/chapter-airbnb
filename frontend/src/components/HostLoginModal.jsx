import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react';

export default function HostLoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // 1-Click Demo Host Login Fill
  const fillDemoCredentials = () => {
    setMode('login');
    setEmail('host@airbnb.com');
    setPassword('host123');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' 
        ? { email, password }
        : { name, email, password, phone };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed.');
      }

      // Save token and host info
      localStorage.setItem('airbnb_token', data.token);
      localStorage.setItem('airbnb_host', JSON.stringify(data.host));

      onLoginSuccess(data.host, data.token, mode === 'login' ? 'Logged in as Host successfully!' : 'Host registered and logged in!');
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Host Portal</h2>
          <p className="text-rose-100 text-xs mt-1">Manage listings, add homes & view host dashboard</p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center justify-between">
          <div className="text-xs text-amber-800">
            <span className="font-bold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              Default Host ID & Password:
            </span>
            <div className="mt-0.5 text-amber-700 font-mono text-[11px]">
              ID: <span className="font-semibold">host@airbnb.com</span> | Pass: <span className="font-semibold">host123</span>
            </div>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold px-2.5 py-1 rounded-md transition shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            Quick Fill
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${
              mode === 'login'
                ? 'text-rose-600 border-rose-500 bg-rose-50/30'
                : 'text-gray-500 border-transparent hover:text-gray-800'
            }`}
          >
            Host Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${
              mode === 'register'
                ? 'text-rose-600 border-rose-500 bg-rose-50/30'
                : 'text-gray-500 border-transparent hover:text-gray-800'
            }`}
          >
            Register as Host
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Host Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          {/* Host ID / Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Host ID / Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="host@airbnb.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-mono text-gray-800"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-mono"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{mode === 'login' ? 'Sign In as Host' : 'Create Host Account'}</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
