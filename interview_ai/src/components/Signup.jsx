import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoginSuccess } from './Redux/slices/Auth_Slice';
import api from '../services/api';
import toast from 'react-hot-toast';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.data?.success) {
        toast.success(response.data.message || 'Account created successfully!');
        dispatch(
          setLoginSuccess({
            token: response.data.token,
            user: response.data.user,
          })
        );
        navigate('/Details');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const msg = error.response?.data?.message || 'Failed to create account';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Watch the password field to validate the "Confirm Password" field
  const password = watch('password');

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#121218] to-[#1f2937] p-4'>
      <form
        className='w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700 p-8 shadow-2xl text-white'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2 className='mb-2 text-center text-3xl font-bold text-white'>Create Account</h2>
        <p className='mb-6 text-center text-sm text-gray-400'>
          Join AI Interviewer and master your technical interviews
        </p>

        {/* Full Name */}
        <div className='mb-4 flex flex-col'>
          <label htmlFor='name' className='mb-1 text-sm font-medium text-gray-300'>
            Full Name
          </label>
          <input
            type='text'
            id='name'
            placeholder='John Doe'
            className='rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className='mt-1 text-xs text-red-400'>{errors.name.message}</span>}
        </div>

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
        <div className='mb-4 flex flex-col'>
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
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.password && <span className='mt-1 text-xs text-red-400'>{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className='mb-6 flex flex-col'>
          <label htmlFor='confirmPassword' className='mb-1 text-sm font-medium text-gray-300'>
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            placeholder='••••••••'
            className='rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <span className='mt-1 text-xs text-red-400'>{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white transition duration-200 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 cursor-pointer'
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Footer Navigation */}
        <p className='mt-6 text-center text-sm text-gray-400'>
          Already have an account?{' '}
          <Link to='/Login' className='font-semibold text-indigo-400 hover:text-indigo-300 hover:underline'>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
