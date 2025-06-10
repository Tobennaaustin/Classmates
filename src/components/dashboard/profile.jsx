import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase"; // adjust path as needed

const ProfileDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen(!open);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <div
        onClick={toggleDropdown}
        className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold uppercase overflow-hidden cursor-pointer"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="h-9 w-9 object-cover"
          />
        ) : (
          user?.displayName?.slice(0, 1)
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ">
          <ul className="py-2 text-sm text-gray-700">
            <li
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Profile
            </li>
            {/* <li
              onClick={() => {
                navigate("/settings");
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Settings
            </li> */}
            <li
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
