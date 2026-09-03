import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomeList from './components/HomeList';
import AddHomeModal from './components/AddHomeModal';
import HostLoginModal from './components/HostLoginModal';
import HomeDetailsModal from './components/HomeDetailsModal';
import Toast from './components/Toast';
import { Database, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedHome, setSelectedHome] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubmittingHome, setIsSubmittingHome] = useState(false);
  
  // Host Authentication state
  const [host, setHost] = useState(() => {
    try {
      const saved = localStorage.getItem('airbnb_host');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('airbnb_token') || '';
  });

  // Toast notifications
  const [toast, setToast] = useState(null);

  // MongoDB connection status
  const [isMongoConnected, setIsMongoConnected] = useState(false);

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch homes from REST API
  const fetchHomes = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const url = query.trim() 
        ? `/api/homes?search=${encodeURIComponent(query.trim())}` 
        : '/api/homes';
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.homes)) {
        setHomes(data.homes);
        setIsMongoConnected(!!data.isMongoConnected);
      } else {
        throw new Error(data.message || 'Failed to fetch homes');
      }
    } catch (err) {
      console.error('Error loading homes:', err);
      showToast('Could not load homes from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchHomes();
  }, [fetchHomes]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHomes(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchHomes]);

  // Handle Add Home
  const handleAddHome = async (formData) => {
    if (!token) {
      setIsAddModalOpen(false);
      setIsLoginModalOpen(true);
      showToast('Please sign in as a host to list your home.', 'error');
      return;
    }

    setIsSubmittingHome(true);
    try {
      const res = await fetch('/api/homes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add home');
      }

      // Add to list and close modal
      setHomes(prev => [data.home, ...prev]);
      setIsAddModalOpen(false);
      showToast('🎉 Home registered successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingHome(false);
    }
  };

  // Handle Delete Home (for host)
  const handleDeleteHome = async (homeId) => {
    if (!token) {
      showToast('Please log in as host to perform this action.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/homes/${homeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete home');
      }

      setHomes(prev => prev.filter(h => (h._id || h.id) !== homeId));
      showToast('Listing removed successfully.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handle Host Login / Register Success
  const handleLoginSuccess = (hostData, tokenData, message) => {
    setHost(hostData);
    setToken(tokenData);
    showToast(message || 'Welcome to Airbnb Host Portal!');
  };

  // Handle Host Logout
  const handleLogout = () => {
    localStorage.removeItem('airbnb_host');
    localStorage.removeItem('airbnb_token');
    setHost(null);
    setToken('');
    showToast('Logged out from Host account.');
  };

  // Click Add Home from Navbar
  const handleOpenAddHome = () => {
    if (!host) {
      setIsLoginModalOpen(true);
      showToast('Please sign in as Host (Use demo: host@airbnb.com / host123)', 'error');
    } else {
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-rose-500 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Banner for Demo Credentials */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        <span>
          Airbnb Host Access Ready — Host ID: <strong className="underline underline-offset-2">host@airbnb.com</strong> | Password: <strong className="underline underline-offset-2">host123</strong>
        </span>
        {!host && (
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="ml-2 bg-white text-rose-600 font-bold px-2.5 py-0.5 rounded-full hover:bg-rose-50 text-[11px] shadow-xs cursor-pointer"
          >
            Login as Host
          </button>
        )}
      </div>

      {/* Navbar Component */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        host={host}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddHome={handleOpenAddHome}
      />

      {/* Main Home Listings Grid */}
      <div className="flex-1">
        <HomeList
          homes={homes}
          loading={loading}
          searchQuery={searchQuery}
          onViewDetails={(home) => setSelectedHome(home)}
          isHost={!!host}
          onDelete={handleDeleteHome}
          onOpenAddHome={handleOpenAddHome}
        />
      </div>

      {/* Modals */}
      <AddHomeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHome={handleAddHome}
        isSubmitting={isSubmittingHome}
      />

      <HostLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <HomeDetailsModal
        home={selectedHome}
        onClose={() => setSelectedHome(null)}
        onBookSuccess={(name) => showToast(`🎉 Reservation confirmed for ${name}!`)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16 text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span>© 2026 Airbnb, Inc. Clone Upgrade.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with React, Node.js, Express & MongoDB
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Database indicator */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
              isMongoConnected 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{isMongoConnected ? 'MongoDB Connected' : 'Local Storage Mode'}</span>
            </div>

            {/* Host Status indicator */}
            {host && (
              <div className="flex items-center gap-1 text-rose-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Host: {host.name}</span>
              </div>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}
