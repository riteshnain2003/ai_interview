import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoginSuccess } from './Redux/slices/Auth_Slice';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data?.success) {
        toast.success(response.data.message || 'Login successful!');
        dispatch(
          setLoginSuccess({
            token: response.data.token,
            user: response.data.user,
          })
        );
        const destination = location.state?.from?.pathname || '/Details';
        navigate(destination, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Failed to sign in. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-[calc(100vh-64px)] items-center justify-center p-4 sm:p-6'>
      <form
        className='w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700/80 p-5 sm:p-8 shadow-2xl text-white my-4'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2 className='mb-2 text-center text-2xl sm:text-3xl font-bold text-white'>Welcome Back</h2>
        <p className='mb-6 text-center text-sm text-gray-400'>
          Log in to continue your AI mock interview preparation
        </p>

        {/* Email */}
        <div className='mb-4 flex flex-col'>
          <label htmlFor='email' className='mb-1 text-sm font-medium text-gray-300'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            placeholder='john@example.com'
            className='rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <span className='mt-1 text-xs text-red-400'>{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className='mb-6 flex flex-col'>
          <label htmlFor='password' className='mb-1 text-sm font-medium text-gray-300'>
            Password
          </label>
          <input
            type='password'
            id='password'
            placeholder='••••••••'
            className='rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && <span className='mt-1 text-xs text-red-400'>{errors.password.message}</span>}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white transition duration-200 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 cursor-pointer'
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Footer Navigation */}
        <p className='mt-6 text-center text-sm text-gray-400'>
          Don't have an account?{' '}
          <Link to='/Signup' className='font-semibold text-indigo-400 hover:text-indigo-300 hover:underline'>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
