import React from 'react';
import interview from "../assets/interview.jpeg";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.avif";
import img3 from "../assets/img3.jpg";
import Footer from "./Footer";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const data = [
    {
      h1: "Real-Time Conversational AI",
      desc: "Simulate natural technical discussions with real-time adaptive questioning.",
      img: img1
    },
    {
      h1: "Code & Architecture Sandbox",
      desc: "Solve algorithmic challenges and evaluate system design architectures live.",
      img: img2
    },
    {
      h1: "Deep Post-Interview Analytics",
      desc: "Actionable metrics, strength breakdown, and comprehensive AI performance scoring.",
      img: img3
    }
  ];

  const startmock = () => {
    navigate("/Details");
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 lg:pt-20 pb-12 w-full'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12'>
          
          {/* Left Text Content */}
          <div className='flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 gap-4 sm:gap-5'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium'>
              <span className='w-2 h-2 rounded-full bg-blue-400 animate-pulse'></span>
              AI-Powered Technical Assessment
            </div>

            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.15]'>
              Master Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'>Next</span> Interview with <span className='text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-400'>AI</span>
            </h1>

            <p className='text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl leading-relaxed'>
              Practice real-time technical, system design, and behavioral interviews.
              Get instant, deep feedback on your answers with targeted insights.
            </p>

            <div className='pt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center'>
              <button
                onClick={startmock}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 focus:outline-none active:scale-95 font-semibold rounded-2xl text-base sm:text-lg px-6 sm:px-7 py-3.5 shadow-xl shadow-blue-500/25 transition-all cursor-pointer"
              >
                <span>Start Your Mock Interview</span>
                <FaLongArrowAltRight className='text-lg' />
              </button>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className='w-full lg:w-1/2 relative flex justify-center items-center px-2 sm:px-6'>
            {/* Glowing Backdrop */}
            <div className='absolute -inset-2 bg-gradient-to-tr from-cyan-500/30 via-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl sm:blur-3xl opacity-70 pointer-events-none'></div>

            <div className='relative z-10 w-full max-w-md lg:max-w-lg transition-transform duration-500 hover:scale-[1.02] lg:[transform:rotateX(10deg)_rotateY(-12deg)_rotateZ(4deg)]'>
              <img
                className='w-full h-auto rounded-2xl shadow-2xl border border-blue-400/30 object-cover'
                src={interview}
                alt="AI Mock Interview Interface"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20 w-full'>
        <div className='flex flex-col items-center text-center gap-2 mb-10'>
          <p className='text-xs sm:text-sm font-semibold uppercase tracking-wider text-indigo-400'>
            Features at a Glance
          </p>
          <h2 className='text-2xl sm:text-4xl text-white font-bold tracking-tight'>
            Built for Modern Developers
          </h2>
          <p className='text-sm sm:text-base text-gray-400 max-w-2xl'>
            Experience realistic technical interviews tailored specifically to your resume and targeted job role.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {data.map((item, index) => (
            <div
              key={index}
              className='flex flex-col bg-gray-900/80 border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300'
            >
              <div className='overflow-hidden rounded-xl bg-gray-950 aspect-video mb-4 border border-gray-800'>
                <img
                  src={item.img}
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                  alt={item.h1}
                />
              </div>
              <h3 className='font-bold text-lg text-white mb-2'>{item.h1}</h3>
              <p className='text-sm text-gray-400 leading-relaxed'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
