import React from 'react';
import { Link } from 'react-router-dom';
import ai from '../assets/ai.png';
import linkdin from  "../assets/linkdin.jpg"
import github from "../assets/github.webp"
import robo from "../assets/robo.png"

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-md text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Description (Spans 2 columns on lg screens) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <img src={ai} alt="AI Interviewer Logo" className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30" />
              <span className="text-2xl font-bold text-white tracking-wide">
                AI <span className="text-blue-400">Interviewer</span>
              </span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Empowering engineers and developers to master real-world technical, system design, and behavioral interviews with real-time AI simulations and deep analytical feedback.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9  rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
               <img src={github} className='w-9 h-8' alt="" />
              </a>

              {/* Twitter / X */}
              

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
                <img src={linkdin} alt="" />

                
              </a>

              
              
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">Conversational AI</a>
              </li>
              <li>
                <a href="#sandbox" className="hover:text-blue-400 transition-colors">Code Sandbox</a>
              </li>
              <li>
                <a href="#analytics" className="hover:text-blue-400 transition-colors">Feedback & Analytics</a>
              </li>
              <li>
                <a href="#questions" className="hover:text-blue-400 transition-colors">Question Bank</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing Plans</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href="#prep-guide" className="hover:text-blue-400 transition-colors">Interview Guides</a>
              </li>
              <li>
                <a href="#system-design" className="hover:text-blue-400 transition-colors">System Design Roadmap</a>
              </li>
              <li>
                <a href="#behavioral" className="hover:text-blue-400 transition-colors">STAR Method Prep</a>
              </li>
              <li>
                <a href="#documentation" className="hover:text-blue-400 transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#community" className="hover:text-blue-400 transition-colors">Developer Community</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Stay Updated */}
          <div>
            <img src={robo} alt="" />
          </div>
          {/* <div className="flex flex-col gap-3">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Stay Ahead</h3>
            <p className="text-xs text-gray-400">
              Get weekly mock interview questions and curated technical tips straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2 mt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm rounded-md bg-neutral-900 border border-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md hover:from-blue-600 hover:to-cyan-600 transition-all active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          </div> */}

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All systems operational</span>
          </div>

          <p>© {currentYear} AI Interviewer. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-gray-300 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
