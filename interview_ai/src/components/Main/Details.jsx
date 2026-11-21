import React, { useEffect, useState } from 'react';
import robot from "../../assets/robo.png";
import { useForm } from 'react-hook-form';
import api from "../../services/api";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setquestion, setsessionid } from "../Redux/slices/Session_Slice";

const Details = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLaunching, setIsLaunching] = useState(false);

    const [inputskill, setinputskills] = useState('');
    const [skills, setskills] = useState([]);
    const Max_SKILLS = 20;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            skills: []
        }
    });

    // Watch the file input
    const resume = watch("resume");
    const hasFile = resume && resume.length > 0;

    // Sync skills state with react-hook-form value
    useEffect(() => {
        register('skills', {
            validate: (val) => (val && val.length > 0) || 'Please add at least one skill.'
        });
        setValue('skills', skills, { shouldValidate: true });
    }, [skills, setValue, register]);

    const submithandler = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === "resume") {
                if (data.resume?.[0]) {
                    formData.append("resume", data.resume[0]);
                }
            } else {
                formData.append(key, data[key]);
            }
        });
        try {
            setIsLaunching(true);
            const response = await api.post("/interview/startinterview", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data) {
                dispatch(setquestion(response.data.firstQuestion));
                dispatch(setsessionid(response.data.sessionId));
                toast.success("Interview session initialized!");
                navigate("/interview");
            }
        } catch (error) {
            console.error("Error during startinterview API call:", error);
            const msg = error.response?.data?.message || "Failed to start interview. Please try again.";
            toast.error(msg);
        } finally {
            setIsLaunching(false);
        }
    };

    const handleadd = () => {
        if (skills.length >= Max_SKILLS) {
            toast.error(`Maximum of ${Max_SKILLS} skills reached.`);
            return;
        }

        const trimskill = inputskill.trim();
        if (!trimskill) {
            return;
        }
        if (skills.includes(trimskill)) {
            toast.error("Skill already added.");
            return;
        }
        setskills((prevskill) => [...prevskill, trimskill]);
        setinputskills('');
    };

    const handleremoveskill = (skillToRemove) => {
        setskills((prevskill) => prevskill.filter((s) => s !== skillToRemove));
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10'>
            <div className='text-center max-w-3xl mx-auto mb-6 sm:mb-10'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight'>
                    Prepare Your AI Interview
                </h1>
                <p className='text-sm sm:text-base text-gray-400 mt-2 sm:mt-3'>
                    Upload your resume, paste target job requirements, and configure your personalized mock interview.
                </p>
            </div>

            <form onSubmit={handleSubmit(submithandler, (validationErrors) => {
                console.log("Validation errors:", validationErrors);
            })}>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>

                    {/* Resume Upload Box */}
                    <div className='flex flex-col gap-3 bg-gray-900 border border-gray-800 hover:border-gray-700/80 rounded-2xl p-4 sm:p-5 shadow-xl min-h-[260px] lg:min-h-[320px]'>
                        <h2 className='text-base sm:text-lg font-semibold text-white'>
                            Candidate Resume
                        </h2>
                        <label
                            htmlFor="res"
                            className="flex flex-col items-center justify-center w-full flex-1 min-h-[170px] sm:min-h-[200px] border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-gray-800/40 hover:bg-gray-800/70 text-center p-4 transition-all"
                        >
                            {hasFile ? (
                                <div className='flex flex-col items-center max-w-full px-2'>
                                    <span className="text-sm font-semibold text-emerald-400">Selected File</span>
                                    <span className="text-xs text-gray-400 mt-1">PDF Format</span>
                                    <p className="text-sm font-medium text-white mt-2 truncate max-w-full">
                                        {resume?.[0]?.name}
                                    </p>
                                    <span className="text-xs text-indigo-400 hover:underline mt-2">Click to replace</span>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center'>
                                    <span className="text-sm font-semibold text-gray-200">Choose Resume PDF</span>
                                    <span className="text-xs text-gray-400 mt-1">Click to browse (.pdf)</span>
                                </div>
                            )}
                        </label>
                        <input
                            id='res'
                            className='hidden'
                            type="file"
                            accept='.pdf'
                            {...register("resume", { required: "Resume is required" })}
                        />
                        {errors.resume && <span className='text-red-400 text-xs font-medium'>{errors.resume.message}</span>}
                    </div>

                    {/* Job Description Box */}
                    <div className='flex flex-col gap-3 bg-gray-900 border border-gray-800 hover:border-gray-700/80 rounded-2xl p-4 sm:p-5 shadow-xl min-h-[260px] lg:min-h-[320px]'>
                        <h2 className='text-base sm:text-lg font-semibold text-white'>
                            Job Description & Requirements
                        </h2>
                        <textarea
                            {...register("description", { required: "Job description is required" })}
                            placeholder="Paste the job description or required qualifications here..."
                            className='mt-1 border border-gray-700/80 focus:border-indigo-500 w-full flex-1 min-h-[160px] p-3.5 sm:p-4 resize-none rounded-xl bg-gray-800/60 text-white placeholder-gray-500 text-sm focus:outline-none transition-colors'
                        />
                        {errors.description && <span className='text-red-400 text-xs font-medium'>{errors.description.message}</span>}
                    </div>

                    {/* Interview Settings Box */}
                    <div className='flex flex-col justify-between gap-6 bg-gray-900 border border-gray-800 hover:border-gray-700/80 rounded-2xl text-white p-5 sm:p-6 shadow-xl col-span-1 lg:row-span-2 lg:col-start-3 lg:row-start-1'>
                        <div className='flex flex-col gap-5'>
                            <h2 className='font-bold text-xl sm:text-2xl text-center text-white'>
                                Interview Settings
                            </h2>

                            <div>
                                <label className='text-white text-sm font-medium block mb-1.5'>
                                    Interview Difficulty
                                </label>
                                <select
                                    {...register("difficulty", { required: "Please select a difficulty" })}
                                    className='bg-gray-800 border border-gray-700 text-white w-full p-2.5 rounded-lg text-sm focus:outline-none focus:border-indigo-500 cursor-pointer'
                                >
                                    <option value="">Select Difficulty</option>
                                    <option value="Easy">Easy (Conceptual & Fundamentals)</option>
                                    <option value="Medium">Medium (Practical & Problem Solving)</option>
                                    <option value="Hard">Hard (Deep Dive & Architecture)</option>
                                </select>
                                {errors.difficulty && <span className='text-red-400 text-xs mt-1 block'>{errors.difficulty.message}</span>}
                            </div>
                        </div>

                        <img src={robot} className='w-24 h-24 sm:w-28 sm:h-28 self-center object-contain drop-shadow-lg' alt="robot avatar" />

                        <button
                            type='submit'
                            disabled={isLaunching}
                            className='cursor-pointer active:scale-95 p-3.5 sm:p-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 font-semibold text-white rounded-xl hover:opacity-95 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20 text-sm sm:text-base'
                        >
                            {isLaunching ? "Launching Interview Room..." : "Launch Interview Room"}
                        </button>
                    </div>

                    {/* Tech Stack & Experience Selection */}
                    <div className='flex flex-col gap-4 bg-gray-900 border border-gray-800 hover:border-gray-700/80 col-span-1 lg:col-span-2 rounded-2xl p-4 sm:p-5 shadow-xl min-h-[160px]'>
                        <h2 className='text-base sm:text-lg font-semibold text-white'>
                            Tech Stack & Seniority Level
                        </h2>

                        <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4'>
                            {/* Target Skills Input */}
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center flex-1'>
                                <span className='text-white text-sm font-medium whitespace-nowrap'>Target Skills:</span>
                                <div className='flex gap-2 flex-1'>
                                    <input
                                        value={inputskill}
                                        className='flex-1 border border-gray-700 rounded-lg text-white text-sm px-3 py-2 bg-gray-800 focus:outline-none focus:border-indigo-500 min-w-0'
                                        placeholder="e.g. React, Node.js"
                                        type="text"
                                        onChange={(e) => setinputskills(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleadd();
                                            }
                                        }}
                                    />
                                    <button
                                        className='rounded-lg active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium transition-all shrink-0 cursor-pointer shadow-sm'
                                        type='button'
                                        onClick={handleadd}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Target Seniority Level */}
                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center shrink-0'>
                                <span className='text-white text-sm font-medium whitespace-nowrap'>Seniority Level:</span>
                                <select
                                    className='border border-gray-700 p-2 rounded-lg bg-gray-800 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer'
                                    {...register("seniority", { required: "Level is required" })}
                                >
                                    <option value="">Select Level</option>
                                    <option value="Fresher">Fresher</option>
                                    <option value="mid-level(1-3 years)">Mid-level (1-3 years)</option>
                                    <option value="Advance Level(4+ years)">Advance Level (4+ years)</option>
                                </select>
                            </div>
                        </div>

                        {errors.skills && <span className='text-red-400 text-xs'>{errors.skills.message}</span>}
                        {errors.seniority && <span className='text-red-400 text-xs'>{errors.seniority.message}</span>}

                        {/* Skills Chips */}
                        <div className='flex flex-wrap gap-2 mt-1 overflow-y-auto max-h-[85px] pr-1'>
                            {skills.length === 0 ? (
                                <span className='text-xs text-gray-500 italic'>No skills added yet. Add at least one skill.</span>
                            ) : (
                                skills.map((item, idx) => (
                                    <span
                                        className='text-xs text-gray-200 bg-gray-800 border border-gray-700 hover:border-red-500/60 py-1 px-3 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-red-950/40 transition-colors'
                                        key={idx}
                                        title="Click to remove"
                                        onClick={() => handleremoveskill(item)}
                                    >
                                        <span>{item}</span>
                                        <span className='text-xs font-bold text-gray-400 hover:text-red-400'>×</span>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default Details;
