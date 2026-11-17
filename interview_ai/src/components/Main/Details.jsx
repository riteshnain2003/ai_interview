import React, { useEffect, useState } from 'react';
import { MdCompareArrows } from "react-icons/md";
import { MdKeyboardVoice } from "react-icons/md";
import { FaKeyboard } from "react-icons/fa";
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

    const format = [
        { id: 1, img: <MdCompareArrows />, value: "Both", text: "Both (Active)" },
        { id: 2, img: <MdKeyboardVoice />, value: "Voice", text: "Voice" },
        { id: 3, img: <FaKeyboard />, value: "Text", text: "Text" }
    ];

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
        const length = skills.length;
        if (length >= Max_SKILLS) {
            return;
        }

        const trimskill = inputskill.trim();
        if (!trimskill) {
            return;
        }
        setskills((prevskill) => [...prevskill, trimskill]);
        setinputskills('');
    };

    const handleremoveskill = (skillToRemove) => {
        setskills((prevskill) => prevskill.filter((s) => s !== skillToRemove));
    };

    return (
        <>
            <h1 className='text-white mt-8 text-xl p-2 text-center'>
                Upload your resume, paste the target job description, <br /> and start your ai led interview
            </h1>

            <form onSubmit={handleSubmit(submithandler, (validationErrors) => {
                console.log("Validation errors:", validationErrors);
            })}>
                <div className='grid grid-cols-3 gap-2 p-8'>

                    {/* Resume Upload Box */}
                    <div className='flex flex-col gap-3 bg-red-300 rounded-xl max-h-[320px] p-2 box-border'>
                        <h1 className='text-center font-semibold'>Candidate Resume</h1>
                        <label
                            htmlFor="res"
                            className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-center p-4 transition-colors"
                        >
                            {hasFile ? (
                                <>
                                    <span className="text-sm font-semibold text-gray-700">Selected File</span>
                                    <span className="text-xs text-gray-500 mt-1">PDF</span>
                                    <p className="text-sm font-medium text-gray-900 mt-2 truncate max-w-full px-2">
                                        {resume?.[0]?.name}
                                    </p>
                                    <span className="text-xs text-blue-600 underline mt-2">Click to change</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm font-semibold text-gray-700">Choose File</span>
                                    <span className="text-xs text-gray-500 mt-1">PDF</span>
                                </>
                            )}
                        </label>
                        <input
                            id='res'
                            className='hidden'
                            type="file"
                            accept='.pdf'
                            {...register("resume", { required: "Resume is required" })}
                        />
                        {errors.resume && <span className='text-red-700 text-xs font-semibold'>{errors.resume.message}</span>}
                    </div>

                    {/* Job Description Box */}
                    <div className='bg-blue-400 rounded-xl p-2 max-h-[320px] flex flex-col'>
                        <h1 className='text-center font-semibold'>Job Description & Requirements</h1>
                        <textarea
                            {...register("description", { required: "Job description is required" })}
                            placeholder="Paste job description here..."
                            className='mt-2 border w-full flex-1 p-4 resize-none border-dashed border-gray-300 rounded-lg bg-gray-800 text-white'
                        />
                        {errors.description && <span className='text-red-700 text-xs font-semibold mt-1'>{errors.description.message}</span>}
                    </div>

                    {/* Interview Settings Box */}
                    <div className='flex flex-col gap-10 bg-gray-800 row-span-2 rounded-xl text-white p-4'>
                        <h1 className='font-semibold text-2xl text-center'>Interview Settings</h1>
                        {/* <p className='font-semibold'>Answering Format</p>
                        <div className='flex justify-between gap-2'>
                            {format.map((item) => (
                                <div
                                    onClick={() => setValue("format", item.value)}
                                    key={item.id}
                                    className={`${selectedformat === item.value ? "border-2 border-blue-500 bg-gray-600" : "border border-gray-500 bg-gray-700"} cursor-pointer w-full flex flex-col justify-center items-center rounded-2xl p-4 transition-all`}
                                >
                                    {item.img}
                                    <h1 className='text-xs mt-1 text-center'>{item.text}</h1>
                                </div>
                            ))}
                        </div> */}

                        <div className='text-black'>
                            <label className='text-white text-sm block mb-1'>Difficulty</label>
                            <select
                                {...register("difficulty", { required: "Please select a difficulty" })}
                                className='bg-white w-full p-2 rounded'
                            >
                                <option value="">Select Difficulty</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                            {errors.difficulty && <span className='text-red-400 text-xs'>{errors.difficulty.message}</span>}
                        </div>

                        <img src={robot} className='w-28 h-28 self-center object-contain' alt="robot" />
                        <button
                            type='submit'
                            disabled={isLaunching}
                            className='cursor-pointer border active:scale-95 p-4 bg-gradient-to-r from-blue-600 to-blue-400 font-semibold text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50'
                        >
                            {isLaunching ? "Launching Interview Room..." : "Launch Interview Room"}
                        </button>
                    </div>

                    {/* Tech Stack & Experience Selection */}
                    <div className='flex flex-col gap-2 bg-yellow-700 col-span-2 rounded-xl p-4 min-h-[160px]'>
                        <h1 className='text-center text-white text-xl font-semibold'>Tech Stack & Experience Selection</h1>
                        <div className='flex justify-between px-3 items-center flex-wrap gap-2'>
                            <div>
                                <div className='flex gap-3 items-center'>
                                    <h2 className='text-white font-semibold'>Target Skills</h2>
                                    <input
                                        value={inputskill}
                                        className='border rounded-lg text-white text-sm px-2 py-1 bg-gray-800'
                                        placeholder="Add a skill"
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
                                        className='border rounded active:scale-95 bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm'
                                        type='button'
                                        onClick={handleadd}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className='flex gap-1 flex-col'>
                                <h1 className='text-white text-sm'>Target Seniority Level</h1>
                                <select
                                    className='border border-white p-1 rounded-lg bg-white text-black text-sm'
                                    {...register("seniority", { required: "Level is required" })}
                                >
                                    <option value="">Select Level</option>
                                    <option value="Fresher">Fresher</option>
                                    <option value="mid-level(1-3 years)">mid-level (1-3 years)</option>
                                    <option value="Advance Level(4+ years)">Advance Level (4+ years)</option>
                                </select>
                                {errors.seniorityLevel && <span className='text-red-300 text-xs'>{errors.seniorityLevel.message}</span>}
                            </div>
                        </div>

                        {errors.skills && <span className='text-red-300 text-xs px-3'>{errors.skills.message}</span>}

                        <div className='flex flex-wrap gap-2 px-3 mt-2 overflow-y-auto max-h-[80px]'>
                            {skills.map((item, idx) => (
                                <span
                                    className='text-xs text-white bg-black/40 border border-white/30 py-1 px-3 rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-500/40'
                                    key={idx}
                                    title="Click to remove"
                                    onClick={() => handleremoveskill(item)}
                                >
                                    {item}
                                    <span className='text-xs font-bold ml-1'>X</span>
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </form>
        </>
    );
};

export default Details;