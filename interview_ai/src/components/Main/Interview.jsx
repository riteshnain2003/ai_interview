import React, { useState } from 'react';
import img1 from "../../assets/robo_interview.png";
import { GoDotFill } from "react-icons/go";
import candidate from "../../assets/candidate.jpg";
import { ImPhoneHangUp } from "react-icons/im";
import { MdOutlineStart } from "react-icons/md";
import { GiCrossedBones } from "react-icons/gi";
import { TiTick } from "react-icons/ti";
import { useSelector, useDispatch } from 'react-redux';
import { setquestion, setquestionno, setreport } from '../Redux/slices/Session_Slice';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Interview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionid = useSelector((state) => state.Interview?.sessionid);
  const Question = useSelector((state) => state.Interview?.question);
  const questionno = useSelector((state) => state.Interview?.questionno || 1);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [showmodel, setshowmodel] = useState({ status: false, text: "", type: "" });

  const handleGenerateScore = async () => {
    setshowmodel({ status: false, text: "", type: "" });
    if (!sessionid) {
      toast.error("No active interview session found");
      return;
    }
    try {
      toast.loading("Generating your interview performance report...", { id: "scoreToast" });
      const finalreport = await api.post("/interview/getscore", { sessionid });
      const reportData = finalreport.data?.report;

      if (reportData) {
        localStorage.setItem("interviewReport", JSON.stringify(reportData));
        dispatch(setreport(reportData));
        toast.success("Score generated successfully!", { id: "scoreToast" });
        navigate("/Report");
      } else {
        toast.error("Report data was empty", { id: "scoreToast" });
      }
    } catch (err) {
      console.error('Error in getscore API call:', err);
      toast.error(err.response?.data?.message || "Failed to generate score", { id: "scoreToast" });
    }
  };

  const handleModalConfirm = () => {
    if (showmodel.type === "generate") {
      handleGenerateScore();
    } else if (showmodel.type === "end") {
      setshowmodel({ status: false, text: "", type: "" });
      toast("Interview ended", { icon: "👋" });
      navigate("/Details");
    }
  };

  const handleModalClose = () => {
    setshowmodel({ status: false, text: "", type: "" });
  };

  const submithandler = async (data) => {
    if (!sessionid) {
      toast.error("No active session found. Please start a new interview.");
      navigate("/Details");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/interview/submitanswer", {
        answer: data.answer,
        sessionid,
      });

      if (response.data?.nextQuestion) {
        dispatch(setquestion(response.data.nextQuestion));
        dispatch(setquestionno(response.data.question_no));
        reset();
      }

      if (response.data?.isCompleted === true) {
        toast.success("Interview finished! Generating report...", { duration: 2500 });
        await handleGenerateScore();
      }
    } catch (err) {
      console.error("Error in submit answer:", err);
      toast.error(err.response?.data?.message || "Error submitting answer. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='grid grid-cols-2 gap-4 p-4 px-10 max-w-6xl mx-auto mt-4'>
      {/* AI Interviewer View */}
      <div className='relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 h-72 shadow-lg'>
        <img src={img1} alt="AI Interviewer" className='w-full h-full object-cover opacity-90' />
        <div className='absolute top-3 left-3 z-10'>
          <p className='flex gap-2 items-center text-xs text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full'>
            AI Interviewer (Technical Lead)
          </p>
        </div>
        <div className='absolute bottom-3 right-3 z-10'>
          <p className='flex gap-1.5 items-center text-xs text-white bg-emerald-600 px-3 py-1 rounded-full font-medium'>
            <GoDotFill className='animate-pulse' /> Live
          </p>
        </div>
      </div>

      {/* Candidate View */}
      <div className='relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 h-72 shadow-lg'>
        <img src={candidate} alt="Candidate" className='w-full h-full object-cover p-2' />
        <p className='absolute top-3 left-3 rounded-full text-xs text-white bg-black/60 backdrop-blur-md px-3 py-1'>
          Candidate (You)
        </p>
      </div>

      {/* Live Conversation Transcript */}
      <div className='flex flex-col bg-gray-900 rounded-2xl border border-gray-700 h-72 text-white shadow-lg overflow-hidden'>
        <div className='flex justify-between items-center border-b border-gray-800 p-3 bg-black/30'>
          <h2 className='text-sm font-semibold tracking-wide'>Live Interview Question</h2>
          <p className='flex gap-1.5 text-xs bg-gray-800 rounded-full px-3 py-1 items-center text-gray-300'>
            AI Status <GoDotFill className='text-emerald-400 animate-pulse' />
          </p>
        </div>
        <div className='p-4 overflow-y-auto flex-1'>
          <p className='text-emerald-400 font-bold text-base mb-2'>
            Question {questionno}:
          </p>
          <p className='text-gray-100 text-lg leading-relaxed'>
            {Question ? Question : "Preparing your question..."}
          </p>
        </div>
      </div>

      {/* Answer Input Area */}
      <div className='bg-gray-900 rounded-2xl border border-gray-700 h-72 p-4 flex flex-col justify-between shadow-lg'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-white font-semibold text-sm'>Your Response</h3>
          <span className='text-xs text-gray-400'>Be as clear and structured as possible</span>
        </div>
        <form onSubmit={handleSubmit(submithandler)} className='flex flex-col flex-1 justify-between'>
          <textarea
            {...register("answer", { required: "Please enter your response before submitting." })}
            placeholder='Type your response here...'
            className='bg-gray-800/80 p-3 text-white resize-none w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl flex-1 text-sm border border-gray-700'
          />
          {errors.answer && (
            <span className='text-red-400 text-xs mt-1'>{errors.answer.message}</span>
          )}
          <div className='text-right mt-2'>
            <button
              type='submit'
              disabled={submitting}
              className='bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer shadow-md'
            >
              {submitting ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Action Bar */}
      <div className='flex w-full gap-4 justify-center col-span-2 mt-2'>
        <button
          onClick={() => setshowmodel({ status: true, text: "Are you sure you want to end this interview?", type: "end" })}
          title="End Interview"
          className='active:scale-95 hover:bg-red-700 bg-red-600 text-white p-3.5 rounded-full transition-all shadow-lg cursor-pointer'
        >
          <ImPhoneHangUp className='text-lg' />
        </button>
        <button
          onClick={() => setshowmodel({ status: true, text: "Do you want to conclude now and generate your evaluation score?", type: "generate" })}
          title="Conclude and Generate Score"
          className='active:scale-95 hover:bg-emerald-700 bg-emerald-600 text-white p-3.5 rounded-full transition-all shadow-lg cursor-pointer'
        >
          <MdOutlineStart className='text-lg' />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showmodel.status && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
          <div className='flex flex-col gap-6 bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md items-center p-8 text-center text-white shadow-2xl'>
            <p className='text-xl font-semibold'>{showmodel.text}</p>
            <div className='flex gap-6 mt-2'>
              <button
                onClick={handleModalClose}
                className='active:scale-95 bg-gray-700 hover:bg-gray-600 text-white p-3.5 rounded-full transition-all cursor-pointer'
                title="Cancel"
              >
                <GiCrossedBones className='text-lg' />
              </button>
              <button
                onClick={handleModalConfirm}
                className='active:scale-95 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full transition-all cursor-pointer'
                title="Confirm"
              >
                <TiTick className='text-2xl' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
