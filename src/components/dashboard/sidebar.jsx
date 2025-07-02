// src/components/dashboard/Sidebar.jsx
import { NavLink, Link } from "react-router-dom";
import { auth } from "../../services/firebase";
import { LogOut, BookOpenText, Plus, LogIn, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

const Sidebar = ({ userClasses }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-side text-white flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* App title */}
        <Link class="flex items-center space-x-2 p-6" to="/dashboard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-book-text h-6 w-6 text-purple-600"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            <path d="M8 11h8"></path>
            <path d="M8 7h6"></path>
          </svg>

          <span class="font-bold sm:inline-block text-lg">Classmate</span>
        </Link>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-3 py-1 rounded-md transition ${
                isActive ? "bg-slate" : "hover:bg-[#83388a]"
              }`
            }
          >
            <Users className="w-4 h-4 mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="/create-class"
            className={({ isActive }) =>
              `flex items-center px-3 py-1 rounded-md transition ${
                isActive ? "bg-slate" : "hover:bg-[#83388a]"
              }`
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Class
          </NavLink>

          <NavLink
            to="/join-class"
            className={({ isActive }) =>
              `flex items-center px-3 py-1 rounded-md transition ${
                isActive ? "bg-slate" : "hover:bg-[#83388a]"
              }`
            }
          >
            <LogIn className="w-4 h-4 mr-2" />
            Join Class
          </NavLink>

          {/* Divider */}
          <hr className="border-gray-700 my-2 mt-5" />

          <div className="mt-10">
  <div className="text-xs text-gray-400 uppercase mt-4 mb-3 px-3">
    My Classes
  </div>

  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1 ">
    {userClasses && userClasses.length > 0 ? (
      userClasses.map((cls) => (
        <NavLink
          key={cls.id}
          to={`/class/${cls.id}`}
          className={({ isActive }) =>
            `transition text-base px-3 py-2 flex items-center space-x-2 text-gray-300 rounded-md ${
              isActive ? "bg-slate" : "hover:bg-[#83388a]"
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-book-text h-5 w-5 text-primary"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
            <path d="M8 11h8"></path>
            <path d="M8 7h6"></path>
          </svg>
          <span className="truncate">{cls.name}</span>
        </NavLink>
      ))
    ) : (
      <div className="text-sm px-3 py-2 text-gray-500">No classes yet</div>
    )}
  </div>
</div>

        </nav>
      </div>

      {/* Log out */}
      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:text-white flex items-center gap-2 p-6"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    </aside>
  );
};

export default Sidebar;
