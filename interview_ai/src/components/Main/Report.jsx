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
     } catch (e) {
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
       <div className='min-h-[70vh] flex flex-col items-center justify-center text-white gap-4'>
         <p className='text-xl text-gray-300'>No interview report found for this session.</p>
         <button
           onClick={() => navigate('/Details')}
           className='bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium px-5 py-2.5 rounded-lg transition-all cursor-pointer'
         >
           Start a Mock Interview
         </button>
       </div>
     );
   }

  return (
    <div className='min-h-screen text-white pb-16'>
        <div className='flex justify-between items-center max-w-4xl mx-auto pt-6 px-4'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>
              Interview Performance Evaluation
            </h1>
            <button
              onClick={handleNewInterview}
              className='bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md'
            >
              Take Another Interview
            </button>
        </div>
        
        <div className='flex flex-col gap-6 max-w-4xl mx-auto mt-6 px-4'>
            {/* Score Card */}
            <div className='flex flex-col gap-4 items-center p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl'>
                <h2 className='text-center text-xl font-semibold text-gray-200'>Overall Score</h2>
                <div className='relative w-44 h-44'>
                     <Doughnut data={data} options={options} />
                     <div className='absolute inset-0 flex flex-col items-center justify-center'>
                       <span className='text-3xl font-extrabold text-white'>{overallScore}</span>
                       <span className='text-xs text-gray-400'>out of 10</span>
                     </div>
                </div>
            </div>

            {/* Summary Section */}
            <div className='bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col gap-2'>
              <h2 className='text-lg font-bold text-emerald-400'>Performance Summary</h2>
              <p className='text-gray-300 leading-relaxed'>{reportdata.summary}</p>
            </div>

            {/* Strengths Section */}
            <div className='bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col gap-2'>
              <h2 className='text-lg font-bold text-emerald-400'>Key Strengths</h2>
              {reportdata.strengths && reportdata.strengths.length > 0 ? (
                <ul className='list-disc list-inside text-gray-300 flex flex-col gap-1.5'>
                  {reportdata.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-400 italic'>No specific strengths recorded for this session.</p>
              )}
            </div>

            {/* Areas For Improvement Section */}
            <div className='bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col gap-2'>
              <h2 className='text-lg font-bold text-amber-400'>Areas for Improvement</h2>
              {reportdata.areasForImprovement && reportdata.areasForImprovement.length > 0 ? (
                <ul className='list-disc list-inside text-gray-300 flex flex-col gap-2'>
                  {reportdata.areasForImprovement.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              ) : (
                <p className='text-gray-400 italic'>Great job! No major areas for improvement noted.</p>
              )}
            </div>

            {/* Detailed Breakdown Section */}
            <div className='bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4'>
              <h2 className='text-lg font-bold text-indigo-400'>Detailed Question Breakdown</h2>
              {reportdata.breakdown && reportdata.breakdown.length > 0 ? (
                reportdata.breakdown.map((item, index) => (
                  <div key={index} className='bg-gray-800/60 p-4 rounded-xl border border-gray-700/60 flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                      <p className='font-semibold text-white'>
                        Question {index + 1}: {item.question || "Question details unavailable"}
                      </p>
                      {item.score !== undefined && (
                        <span className='text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40 font-medium'>
                          Score: {item.score}/10
                        </span>
                      )}
                    </div>
                    {item.answer && (
                      <p className='text-sm text-gray-400 bg-black/30 p-2.5 rounded-lg'>
                        <strong className='text-gray-300'>Your Answer:</strong> {item.answer}
                      </p>
                    )}
                    <p className='text-sm text-emerald-300'>
                      <strong>Feedback:</strong> {item.feedback || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className='text-gray-400 italic'>No breakdown details available.</p>
              )}
            </div>
        </div>
    </div>
  );
};

export default Report;
