import React from 'react';
import ai from "../assets/ai.png";
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from './Redux/slices/Auth_Slice';
import api from '../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.Auth);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    dispatch(setLogout());
    toast.success('Logged out successfully');
    navigate('/Login');
  };

  return (
    <header className='flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 border-b border-gray-800/80 bg-black/60 backdrop-blur-md sticky top-0 z-50 transition-all'>
      {/* Brand */}
      <Link to="/" className='flex gap-2 sm:gap-3 items-center hover:opacity-90 transition-opacity min-w-0 mr-2'>
        <img src={ai} className='w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg object-cover shrink-0' alt="AI Interviewer Logo" />
        <h1 className='text-white font-semibold text-base sm:text-xl lg:text-2xl tracking-tight truncate'>
          AI <span className='text-blue-400'>Interviewer</span>
        </h1>
      </Link>

      {/* Nav Actions */}
      <div className='flex items-center gap-1.5 sm:gap-3 shrink-0'>
        {isAuthenticated ? (
          <div className='flex items-center gap-1.5 sm:gap-3'>
            <span className='text-xs sm:text-sm text-gray-300 font-medium hidden md:inline'>
              Welcome, <strong className='text-indigo-400 font-semibold'>{user?.name || 'Candidate'}</strong>
            </span>
            <button
              onClick={() => navigate('/Details')}
              type="button"
              className="text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 font-medium text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <span className='hidden sm:inline'>Interview </span>Prep
            </button>
            <button
              onClick={handleLogout}
              type="button"
              className="text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 active:scale-95 font-medium text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className='flex text-xs sm:text-sm text-white font-medium gap-1.5 sm:gap-3'>
            <button
              onClick={() => navigate('/Login')}
              type="button"
              className="text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/Signup')}
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 active:scale-95 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
