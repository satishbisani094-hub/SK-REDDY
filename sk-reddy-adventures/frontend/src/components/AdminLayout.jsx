import React from 'react';
import { FaTachometerAlt, FaRoute, FaImages, FaEnvelopeOpen, FaHome, FaSignOutAlt, FaCompass } from 'react-icons/fa';

const AdminLayout = ({ currentTab, setCurrentTab, onViewChange, onLogout, children }) => {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: <FaTachometerAlt /> },
    { id: 'tours', name: 'Manage Tours', icon: <FaRoute /> },
    { id: 'gallery', name: 'Manage Gallery', icon: <FaImages /> },
    { id: 'enquiries', name: 'Enquiries', icon: <FaEnvelopeOpen /> },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col md:flex-row text-white animate-fade-in">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass md:min-h-screen p-6 flex flex-col justify-between shrink-0 border-r border-white/5">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 pb-6 border-b border-white/5">
            <div className="p-2 rounded-xl bg-forest-700 text-white">
              <FaCompass className="text-xl" />
            </div>
            <div>
              <span className="text-md font-bold tracking-wider block">SK REDDY</span>
              <span className="block text-[8px] tracking-[0.2em] uppercase text-forest-500 font-semibold leading-tight">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-4 md:pb-0">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap md:w-full cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-forest-800 text-white shadow-lg border border-forest-600/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="hidden md:flex flex-col gap-3 pt-6 border-t border-white/5">
          <button
            onClick={() => onViewChange('public')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer"
          >
            <FaHome /> Visit Website
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all text-left cursor-pointer"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
