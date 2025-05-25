import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        navigate('/login');
    };

    const handleProfil = () => {
        setIsDropdownOpen(false);
        navigate('/Profil');
    };

    const handleDashboard = () => {
        setIsDropdownOpen(false);
        navigate('/dashboard');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div
                                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                                <span className="text-xl">🍏</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900 leading-tight">Gym Guy's Food</span>
                                <span className="text-xs text-gray-500 font-medium">Fuel Your Fitness</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            to="/recipes"
                            className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200"
                        >
                            <i className="fas fa-utensils text-sm"></i>
                            <span>Recipes</span>
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/my-recipes"
                                    className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200"
                                >
                                    <i className="fas fa-book text-sm"></i>
                                    <span>My Recipes</span>
                                </Link>
                                <Link
                                    to="/recipes/add"
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200 ml-2"
                                >
                                    <i className="fas fa-plus text-sm"></i>
                                    <span>Add Recipe</span>
                                </Link>

                                <div className="relative ml-4" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-all duration-200"
                                    >
                                        <div
                                            className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium leading-tight">{user.username}</span>
                                            <span
                                                className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</span>
                                        </div>
                                        <i
                                            className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`}
                                        ></i>
                                    </button>

                                    {isDropdownOpen && (
                                        <div
                                            className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100">
                                            <div className="py-2">
                                                {user?.role === "ADMIN" && (
                                                    <button
                                                        onClick={handleDashboard}
                                                        className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                    >
                                                        <i className="fas fa-chart-line mr-3 text-emerald-600 w-4"></i>
                                                        <span>Dashboard</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleProfil}
                                                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <i className="fas fa-user mr-3 text-blue-600 w-4"></i>
                                                    <span>Profile</span>
                                                </button>
                                                <hr className="my-1 border-gray-100"/>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                >
                                                    <i className="fas fa-sign-out-alt mr-3 w-4"></i>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3 ml-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200"
                                >
                                    <i className="fas fa-sign-in-alt text-sm"></i>
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <i className="fas fa-user-plus text-sm"></i>
                                    <span>Register</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                        >
                            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <Link
                            to="/recipes"
                            className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                        >
                            <i className="fas fa-utensils mr-3 text-emerald-600 w-5"></i>
                            <span>Recipes</span>
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/my-recipes"
                                    className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                                >
                                    <i className="fas fa-book mr-3 text-emerald-600 w-5"></i>
                                    <span>My Recipes</span>
                                </Link>
                                <Link
                                    to="/recipes/add"
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center px-4 py-3 rounded-lg text-base font-medium shadow-md"
                                >
                                    <i className="fas fa-plus mr-3 w-5"></i>
                                    <span>Add Recipe</span>
                                </Link>

                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <div className="flex items-center px-4 py-2 mb-3">
                                        <div
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-900">{user.username}</div>
                                            <div
                                                className="text-sm text-gray-500 capitalize">{user.role?.toLowerCase()}</div>
                                        </div>
                                    </div>

                                    {user?.role === "ADMIN" && (
                                        <button
                                            onClick={handleDashboard}
                                            className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                                        >
                                            <i className="fas fa-chart-line mr-3 text-emerald-600 w-5"></i>
                                            <span>Dashboard</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={handleProfil}
                                        className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                                    >
                                        <i className="fas fa-user mr-3 text-blue-600 w-5"></i>
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-600 hover:bg-red-50 flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                                    >
                                        <i className="fas fa-sign-out-alt mr-3 w-5"></i>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                                >
                                    <i className="fas fa-sign-in-alt mr-3 text-emerald-600 w-5"></i>
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center px-4 py-3 rounded-lg text-base font-medium shadow-md"
                                >
                                    <i className="fas fa-user-plus mr-3 w-5"></i>
                                    <span>Register</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
        /*<nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl">🍏</span>
                            <span className="text-xl font-bold text-gray-800">Gym Guy's Food</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/recipes" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                            <i className="fas fa-utensils"></i>
                            <span>Recipes</span>
                        </Link>

                        {user ? (
                            <>
                                <Link to="/my-recipes" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                                    <i className="fas fa-book"></i>
                                    <span>My Recipes</span>
                                </Link>
                                <Link to="/recipes/add" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                                    <i className="fas fa-plus"></i>
                                    <span>Add Recipe</span>
                                </Link>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">{user.username}</span>
                                        <i className={`fas fa-chevron-down transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}></i>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                {user?.role === "ADMIN" && (
                                                    <button
                                                        onClick={handleDashboard}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <i className="fas fa-chart-line mr-2"></i> Dashboard
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleProfil}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <i className="fas fa-user mr-2"></i> Profile
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                                    <i className="fas fa-sign-in-alt"></i>
                                    <span>Login</span>
                                </Link>
                                <Link to="/register" className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                                    <i className="fas fa-user-plus"></i>
                                    <span>Register</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                        >
                            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/recipes" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                            <i className="fas fa-utensils mr-2"></i> Recipes
                        </Link>
                        {user ? (
                            <>
                                <Link to="/my-recipes" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                                    <i className="fas fa-book mr-2"></i> My Recipes
                                </Link>
                                <Link to="/recipes/add" className="bg-green-600 text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium">
                                    <i className="fas fa-plus mr-2"></i> Add Recipe
                                </Link>
                                {user?.role === "ADMIN" && (
                                    <button
                                        onClick={handleDashboard}
                                        className="text-gray-600 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        <i className="fas fa-chart-line mr-2"></i> Dashboard
                                    </button>
                                )}
                                <button
                                    onClick={handleProfil}
                                    className="text-gray-600 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                >
                                    <i className="fas fa-user mr-2"></i> Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                >
                                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                                </Link>
                                <Link to="/register" className="bg-green-600 text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium">
                                    <i className="fas fa-user-plus mr-2"></i> Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>*/
    );
};

export default Navbar; 