import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>

    <div className="text-center text-2xl pt-10 text-gray-500">
      <p>ABOUT  <span className="text-gray-700 font-medium">US</span></p>
      </div>

    <div className="my-10 flex flex-col md:flex-row gap-12">
      <img className='w-full md:max-w-[300px]' src={assets.about_image} alt=""/>
    <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
    <p>welcome to priscripto.Your Trusted partner in managing your healthcare
      needs conveniently and efficiently.At prescipto,WE understand teh challanges individuals 
      face when it comes to scheduling doctor appointments and managing their health records.
    </p>
    <p>
      Prescipto is committed to excellence in healthcare technology.We continuously strive to 
      enhance our platform.Integrating The latest advancements to imporver use experience and deliver
      superior service.whether you're booking your first appointment or manging ongoing care.Prescripto is here 
      to support you every step of the way
    </p>
    <b className="text-gray-800">Our Vision</b>
    <p>Our vision at prescipt is to creat a seam less healtcare experican for every use. we aim to bridge the gap between
      patients and healthcare providers.Making it Easier for you to acces the care you need. When you need it.
    </p>
    </div>
  </div>
   <div className="text-xl my-4">
      <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
    </div>
  <div className="flex flex-col sm:flex-row mb-20">
    <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer" >
    <b>Efficiency: </b>
     <p>
  stremlined appointment scheduling that fits into your your busy lifestyle. </p>
    </div>
    <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
     <b>Convenience:</b>
     <p>Access to a network of trusted healthcare professionals in your area.</p>
    </div>
    <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
    <b>Personalization:</b>
    <p>Tailored recommandations and reminders to help you stay on top of your health.</p>
    </div>
  </div>  
</div>
  );
};

export default About;