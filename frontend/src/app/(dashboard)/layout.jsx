"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const CoursesLayout = ({ children }) => {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const settingsRef = React.useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };
    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
        closeDropdown();
        return;
    };

    const handleOutsideClick = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            settingsRef.current &&
            !settingsRef.current.contains(event.target)
        ) {
            closeDropdown();
        }
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div>
            <nav className="bg-blue-600 px-4 py-2 flex justify-between items-center font-bold fixed w-full">
                <Link href="/courses" className="flex items-center">
                    <div className="bg-white rounded-md w-8 h-8 mr-3"></div>
                    <span className="text-white text-xl font-bold">COTAM</span>
                </Link>
                <div className="flex space-x-4">
                    <Link
                        id="navbar-courses-btn"
                        href="/courses"
                        className="text-white hover:bg-blue-800 px-4 py-2 rounded-md"
                    >
                        Courses
                    </Link>
                    <Link
                        href="/help"
                        className="text-white hover:bg-blue-800 px-4 py-2 rounded-md"
                    >
                        Help
                    </Link>
                </div>
                <button
                    onClick={toggleDropdown}
                    ref={settingsRef}
                    className="text-white hover:bg-blue-800 px-4 py-2 rounded-md"
                >
                    Settings
                </button>
                {isDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute bg-white flex flex-col right-0 top-14 rounded-bl-xl border-slate-300 border-2"
                    >
                        <Link
                            className="text-sm px-20 py-2 hover:bg-gray-100 font-semibold"
                            href="/profile"
                            onClick={closeDropdown}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={logout}
                            className="text-sm px-20 py-2 hover:bg-gray-100 font-semibold"
                        >
                            <Link href="/">Logout</Link>
                        </button>
                    </div>
                )}
            </nav>
            {children}
        </div>
    );
};

export default CoursesLayout;
