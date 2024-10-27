import { useState } from "react";
import { useAuth } from "../../Context";
import { signOut } from "../../Authentication/firebase/GoogleAuth";
import { Link, NavLink } from "react-router-dom";
import { isLoggedin } from "../../Authentication/isLoggedin";
import { Bids } from "../../Payment/pages";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { currentUser, profile, setCurrentUser } = useAuth();

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex shadow-lg py-4 px-4 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        <Link
          to="/"
          className="lg:absolute max-lg:left-10 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 text-4xl font-bold text-buttonBackground hover:text-buttonHover transition duration-300 ease-in-out"
        >
          AucET
        </Link>

        {isMenuOpen && (
          <div
            id="collapseMenu"
            className={`max-lg:w-full max-lg:fixed max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50`}
          >
            <button
              id="toggleClose"
              onClick={handleToggleMenu}
              className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 fill-black"
                viewBox="0 0 320.591 320.591"
              >
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"
                ></path>
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"
                ></path>
              </svg>
            </button>

            <ul className="lg:flex lg:gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-[9999]">
              <li className="mb-6 hidden max-lg:block">
                <NavLink
                  to="/"
                  className="text-4xl font-bold text-buttonBackground hover:text-buttonHover transition duration-300 ease-in-out"
                >
                  AucET
                </NavLink>
              </li>
              <li className="max-lg:border-b max-lg:py-3 px-3">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-buttonBackground block font-semibold text-[15px]"
                      : "hover:text-buttonBackground text-buttonBackground block font-semibold text-[15px]"
                  }
                >
                  Home
                </NavLink>
              </li>
              {isLoggedin(currentUser, profile) && (
                <>
                  <li className="max-lg:border-b max-lg:py-3 px-3">
                    <NavLink
                      to="/payments"
                      className={({ isActive }) =>
                        isActive
                          ? "text-buttonBackground block font-semibold text-[15px]"
                          : "hover:text-buttonBackground text-[#333] block font-semibold text-[15px]"
                      }
                    >
                      Payments
                    </NavLink>
                  </li>
                  <li className="max-lg:border-b max-lg:py-3 px-3">
                    <NavLink
                      to="/my"
                      className={({ isActive }) =>
                        isActive
                          ? "text-buttonBackground block font-semibold text-[15px]"
                          : "hover:text-buttonBackground text-[#333] block font-semibold text-[15px]"
                      }
                    >
                      My Rooms
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

        <div className="flex items-center ml-auto space-x-6">
          {!isLoggedin(currentUser, profile) ? (
            <>
              <button className="font-semibold text-[15px] border-none outline-none">
                <Link
                  to="/auth"
                  className="text-buttonBackground hover:underline"
                >
                  Login
                </Link>
              </button>
              <Link
                to="/auth"
                className="px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-buttonBackground bg-buttonBackground transition-all ease-in-out duration-300 hover:bg-transparent hover:text-buttonBackground"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4 md:relative">
              <button className="font-semibold text-[15px] border-none outline-none flex gap-1 items-center">
                <img
                  src={
                    profile.photoURL.length
                      ? profile.photoURL
                      : "https://imgs.search.brave.com/GIL_dabaOq4GAxTVyW2oN5sl6gbK1dpS4fspnJz7FJY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9hdmF0YXItcmVz/b3VyY2luZy1jb21w/YW55XzEyNTQ5Njct/NjY1My5qcGc_c2Vt/dD1haXNfaHlicmlk"
                  }
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <span className="mx-2 flex-col gap-1 absolute left-[-100%] hidden md:flex">
                  <a
                    href={`/room`}
                    target="_blank"
                    className="text-buttonBackground hover:underline"
                  >
                    {profile.firstName}
                  </a>
                  <Bids />
                </span>
              </button>
              <button
                onClick={() => signOut(setCurrentUser)}
                className="px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-buttonBackground bg-buttonBackground transition-all ease-in-out duration-300 hover:bg-transparent hover:text-buttonBackground"
              >
                Logout
              </button>
            </div>
          )}

          <button
            id="toggleOpen"
            onClick={handleToggleMenu}
            className="lg:hidden"
          >
            <svg
              className="w-7 h-7"
              fill="#333"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
