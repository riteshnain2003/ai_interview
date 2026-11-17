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
    } catch (e) {
      // Ignore network errors on logout
    }
    dispatch(setLogout());
    toast.success('Logged out successfully');
    navigate('/Login');
  };

  return (
    <header className='flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-40'>
      {/* Brand */}
      <Link to="/" className='flex gap-3 items-center hover:opacity-90 transition-opacity'>
        <img src={ai} className='w-10 h-10 rounded-full shadow-lg' alt="AI Interviewer Logo" />
        <h1 className='text-white font-semibold text-2xl tracking-wide'>AI Interviewer</h1>
      </Link>

      {/* Nav Actions */}
      <div className='flex items-center gap-3'>
        {isAuthenticated ? (
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-300 font-medium hidden sm:inline '>
              Welcome, <strong className='text-indigo-400'>{user?.name || 'Candidate'}</strong>
            </span>
            {/* <button
              onClick={() => navigate('/Details')}
              type="button"
              className="text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 font-medium text-sm px-4 py-2 rounded-lg transition-all"
            >
              Start Interview
            </button> */}
            <button
              onClick={handleLogout}
              type="button"
              className="text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 active:scale-95 font-medium text-sm px-4 py-2 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className='flex text-sm text-white font-medium gap-2'>
            <button
              onClick={() => navigate('/Login')}
              type="button"
              className="text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 px-4 py-2 rounded-lg transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/Signup')}
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 active:scale-95 px-4 py-2 rounded-lg transition-all"
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
