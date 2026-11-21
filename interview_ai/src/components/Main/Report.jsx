import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip);
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setsessionid, setquestion, setquestionno } from '../Redux/slices/Session_Slice';

const Report = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   // Fallback to localStorage if Redux state is cleared on refresh
   const redxReport = useSelector((state) => state.Interview?.report);
   let reportdata = redxReport;
   if (!reportdata) {
     try {
       const saved = localStorage.getItem("interviewReport");
       reportdata = saved ? JSON.parse(saved) : null;
     } catch {
       reportdata = null;
     }
   }

   const overallScore = reportdata?.overallScore ?? 0;
   // Accurate score percentage out of 10
   const scorePercentage = Math.min(Math.max((overallScore / 10) * 100, 0), 100);

   const data = {
     datasets: [
       {
         data: [scorePercentage, 100 - scorePercentage],
         backgroundColor: ['#6366f1', '#374151'],
         borderWidth: 0,
         borderRadius: 20,
       },
     ],
   };

   const options = {
     responsive: true,
     maintainAspectRatio: false,
     cutout: '80%',
     plugins: {
       tooltip: { enabled: false },
     },
   };

   const handleNewInterview = () => {
     dispatch(setsessionid(null));
     dispatch(setquestion(null));
     dispatch(setquestionno(1));
     navigate('/Details');
   };

   if (!reportdata) {
     return (
       <div className='min-h-[70vh] flex flex-col items-center justify-center text-white gap-4 px-4 text-center'>
         <p className='text-lg sm:text-xl text-gray-300'>No interview report found for this session.</p>
         <button
           onClick={() => navigate('/Details')}
           className='bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-md text-sm sm:text-base'
         >
           Start a Mock Interview
         </button>
       </div>
     );
   }

  return (
    <div className='min-h-screen text-white pb-16'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-4xl mx-auto pt-4 sm:pt-6 px-4 sm:px-6'>
            <h1 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>
              Interview Performance Evaluation
            </h1>
            <button
              onClick={handleNewInterview}
              className='w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-md shrink-0'
            >
              Take Another Interview
            </button>
        </div>
        
        <div className='flex flex-col gap-5 sm:gap-6 max-w-4xl mx-auto mt-4 sm:mt-6 px-4 sm:px-6'>
            {/* Score Card */}
            <div className='flex flex-col gap-4 items-center p-5 sm:p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl'>
                <h2 className='text-center text-lg sm:text-xl font-semibold text-gray-200'>Overall Score</h2>
                <div className='relative w-36 h-36 sm:w-44 sm:h-44'>
                     <Doughnut data={data} options={options} />
                     <div className='absolute inset-0 flex flex-col items-center justify-center'>
                       <span className='text-2xl sm:text-3xl font-extrabold text-white'>{overallScore}</span>
                       <span className='text-xs text-gray-400'>out of 10</span>
                     </div>
                </div>
            </div>

            {/* Summary Section */}
            <div className='bg-gray-900 border border-gray-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col gap-2'>
              <h2 className='text-base sm:text-lg font-bold text-emerald-400'>Performance Summary</h2>
              <p className='text-sm sm:text-base text-gray-300 leading-relaxed'>{reportdata.summary}</p>
            </div>

            {/* Strengths Section */}
            <div className='bg-gray-900 border border-gray-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col gap-2'>
              <h2 className='text-base sm:text-lg font-bold text-emerald-400'>Key Strengths</h2>
              {reportdata.strengths && reportdata.strengths.length > 0 ? (
                <ul className='list-disc list-inside text-sm sm:text-base text-gray-300 flex flex-col gap-1.5'>
                  {reportdata.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-gray-400 italic'>No specific strengths recorded for this session.</p>
              )}
            </div>

            {/* Areas For Improvement Section */}
            <div className='bg-gray-900 border border-gray-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col gap-2'>
              <h2 className='text-base sm:text-lg font-bold text-amber-400'>Areas for Improvement</h2>
              {reportdata.areasForImprovement && reportdata.areasForImprovement.length > 0 ? (
                <ul className='list-disc list-inside text-sm sm:text-base text-gray-300 flex flex-col gap-2'>
                  {reportdata.areasForImprovement.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-gray-400 italic'>Great job! No major areas for improvement noted.</p>
              )}
            </div>

            {/* Detailed Breakdown Section */}
            <div className='bg-gray-900 border border-gray-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col gap-4'>
              <h2 className='text-base sm:text-lg font-bold text-indigo-400'>Detailed Question Breakdown</h2>
              {reportdata.breakdown && reportdata.breakdown.length > 0 ? (
                reportdata.breakdown.map((item, index) => (
                  <div key={index} className='bg-gray-800/60 p-4 rounded-xl border border-gray-700/60 flex flex-col gap-2.5'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                      <p className='font-semibold text-white text-sm sm:text-base'>
                        Question {index + 1}: {item.question || "Question details unavailable"}
                      </p>
                      {item.score !== undefined && (
                        <span className='shrink-0 self-start sm:self-auto text-xs bg-indigo-600/30 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-medium'>
                          Score: {item.score}/10
                        </span>
                      )}
                    </div>
                    {item.answer && (
                      <p className='text-xs sm:text-sm text-gray-400 bg-black/30 p-2.5 rounded-lg leading-relaxed'>
                        <strong className='text-gray-300'>Your Answer:</strong> {item.answer}
                      </p>
                    )}
                    <p className='text-xs sm:text-sm text-emerald-300'>
                      <strong>Feedback:</strong> {item.feedback || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-400 italic'>No breakdown details available.</p>
              )}
            </div>
        </div>
    </div>
  );
};

export default Report;
