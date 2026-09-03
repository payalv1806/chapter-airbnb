import React from 'react';
import { Home as HomeIcon, PlusCircle, Search, User, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  host, 
  onOpenLogin, 
  onLogout, 
  onOpenAddHome 
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setSearchQuery('')}>
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 32 32">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.441 7.1 14.52 1.442 3.039 1.616 5.807.502 8.001-1.168 2.302-3.411 3.585-6.315 3.611-3.088-.026-5.46-1.579-6.571-4.32-.423-.97-.565-1.554-.627-1.85-.062.296-.204.88-.627 1.85-1.111 2.741-3.483 4.294-6.571 4.32-2.904-.026-5.147-1.309-6.315-3.611-1.114-2.194-.94-4.962.502-8.001.986-2.079 5.146-10.69 7.1-14.52l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.447 0-2.529.743-3.57 2.604l-.53 1.018C9.972 10.395 5.845 18.94 4.908 20.916c-1.168 2.463-1.282 4.673-.424 6.362.859 1.691 2.508 2.627 4.808 2.646 2.385-.02 4.195-1.196 5.093-3.414.53-1.218.73-2.076.822-2.738l.043-.45.35-.11c.264-.083.568-.124.9-.124s.636.041.9.124l.35.11.043.45c.092.662.292 1.52.822 2.738.898 2.218 2.708 3.394 5.093 3.414 2.3-.019 3.949-.955 4.808-2.646.858-1.689.744-3.899-.424-6.362-.937-1.976-5.064-10.521-6.992-14.294l-.53-1.018C18.529 3.743 17.447 3 16 3zm0 13c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-rose-500 hidden sm:inline-block">airbnb</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by home name or location (e.g. Lakeview)..."
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-gray-400 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Add Home Button */}
            <button
              onClick={onOpenAddHome}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold py-2.5 px-4 rounded-full shadow-md hover:shadow-lg transition duration-200 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">Add Home</span>
            </button>

            {/* Host Auth State */}
            {host ? (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 pl-3 pr-1.5 py-1.5 rounded-full">
                <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span className="max-w-[100px] truncate">{host.name || 'Host'}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Log out from Host account"
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-full hover:bg-white transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 hover:shadow-sm text-gray-700 text-sm font-semibold py-2 px-4 rounded-full transition active:scale-95"
              >
                <User className="w-4 h-4 text-rose-500" />
                <span>Host Login</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
