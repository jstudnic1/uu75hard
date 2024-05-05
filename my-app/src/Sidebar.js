// Sidebar.jsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Make sure to import useAuth
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth(); // Get user and logout function from context
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="sidebar bg-base-200 w-56 text-gray-700">
      <div className="menu-title">
        <span className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
            <span className="text-xs">{user ? user.username[0] : 'G'}</span>
          </div>
          <button
            className="text-white py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-700"
            onClick={toggleDropdown}
            aria-haspopup="true"
            aria-expanded={dropdownOpen ? 'true' : 'false'}
          >
            {user ? user.username : 'Guest'}
            <span className="icon float-right"></span>
          </button>
        </span>
        {dropdownOpen && (
          <div className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <ul>
              <li><a className="rounded hover:bg-gray-200" href="#">Profile</a></li>
              <li><a className="rounded hover:bg-gray-200" onClick={logout}>Sign Out</a></li>
            </ul>
          </div>
        )}
      </div>
            {/* Main menu items */}
			<ul className="menu p-2">
        <li className="menu-item active">
          <a className="rounded hover:bg-gray-200 hover:text-gray-800">
            <span className="icon">📘</span> All Habits
          </a>
        </li>
        <li className="menu-title">AREAS</li>
        <li className="menu-item">
          <a className="rounded hover:bg-gray-200 hover:text-gray-800">
            <span className="icon">➕</span> New Area
          </a>
        </li>
        <li className="menu-title">PREFERENCES</li>
        <li className="menu-item">
          <a className="rounded hover:bg-gray-200 hover:text-gray-800">
            <span className="icon">🔧</span> Manage Habits
          </a>
        </li>
        <li className="menu-item">
          <a className="rounded hover:bg-gray-200 hover:text-gray-800">
            <span className="icon">⚙️</span> App Settings
          </a>
        </li>
        <li className="menu-item">
          <a className="rounded hover:bg-gray-200 hover:text-gray-800">
            <span className="icon">📚</span> Resources
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
