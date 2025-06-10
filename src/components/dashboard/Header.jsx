// src/components/dashboard/Header.jsx
import { auth } from "../../services/firebase";
import { Link } from "react-router-dom";
import ProfileDropdown from "../dashboard/profile";
import { useEffect, useState } from "react";

const Header = ({ onToggleSidebar }) => {
  const user = auth.currentUser;

  return (
    <header class="sticky top-0 z-40 w-full border-b border-gray-200 bg-gray-100">
      <div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4">
        <div class="flex gap-6 md:gap-10 items-center">
          <button
            onClick={onToggleSidebar}
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden"
          >
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
              class="lucide lucide-menu h-5 w-5 color"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
            <span class="sr-only">Toggle Menu</span>
          </button>
          <Link class="flex items-center space-x-2" to="/dashboard">
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
              class="lucide lucide-book-text h-6 w-6 color"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
              <path d="M8 11h8"></path>
              <path d="M8 7h6"></path>
            </svg>
            <span class="hidden font-bold sm:inline-block text-lg">
              Classmate
            </span>
          </Link>
        </div>
        <div class="flex flex-1 items-center justify-end space-x-4">
          {/* <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold uppercase overflow-hidden">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="h-9 w-9 object-cover"
              />
            ) : (
              user?.displayName?.slice(0, 1)
            )}
          </div> */}
          <ProfileDropdown user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
