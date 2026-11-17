import React from 'react'
import interview from "../assets/interview.jpeg"
import img1 from "../assets/img1.png"
import img2 from "../assets/img2.avif"
import img3 from "../assets/img3.jpg"
import Footer from "./Footer"
import mic from "../assets/mic1.jpg"
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate=useNavigate()
    const data=[
        {"h1":"Real-Time conversational Ai","img":img1,},
        {"h1":"Code and system design Sandbox","img":img2},
        {"h1":"Post-Interview Analytics & Feedback","img":img3}
    
    ]

    const startmock=()=>{
        navigate("/Details")

    }

  return (
    <>
        <div className='flex  mt-5  '>
        {/* left div  */}
        <div className='flex flex-col gap-5 w-[50%]  items-center pt-30'>
        <h1 className='text-white font-semibold text-6xl '>Master Your <span className='text-blue-300'>Next</span><br />Interview with <span className='text-red-600'>AI</span></h1>
        <p className='text-md font-semibold text-blue-200'>Practice real-time technical, system design, and behavioural <br />interviews. Get instant, deep feedback on your answer- <br />voice or text.</p>
        </div>
        {/* right div  */}
        <div className='w-[50%] relative flex justify-center'>
            {/* glowing div in background */}
            <div className='absolute top-10 w-[540px] h-[340px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl blur-3xl opacity-60 [transform:rotateX(15deg)_rotateY(-20deg)_rotateZ(10deg)] pointer-events-none'></div>

            <img className='relative z-10 w-[600px] mt-15 shadow-[0px_0px_5px_5px_lightblue] rounded [transform:rotateX(15deg)_rotateY(-20deg)_rotateZ(10deg)]' src={interview} alt="img" />
        </div>
        </div>
        <div className='flex  mt-5 '>
            
        <button onClick={()=>startmock()} type="button" className=" mx-auto flex  items-center gap-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none active:scale-95 font-medium rounded-3xl text-lg px-4 py-3  text-center leading-5">Start Your Mock Interview <FaLongArrowAltRight className='' /></button>
        
        </div>

        {/* bottom card */}
        <div className='flex flex-col  pl-35 mt-20'>
            <p className='text-xl text-gray-400 font-semibold'>Features at a Glance</p>
            <h1 className='text-4xl text-white font-bold'>Trusted by Developers</h1>
        </div>
        <div className='flex justify-around mt-5'>
            {
                data.map((item,index)=>(
                    <div key={index} className='flex items-center flex-col border bg-blue-300 p-1 rounded-xl'>
                        <h1 className='font-bold text-lg text-black'>{item.h1}</h1>
                        <img src={item.img} className='w-100 h-50' alt="img" />
                    </div>
                ))

            }
        </div>

        {/* footer  */}
        <Footer />

    </>

  )
}


export default Home
