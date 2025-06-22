import React, { useContext, useState } from "react";
import {assets} from "../../assets/assets";
//import { useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import {toast} from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocImg(e.target.files[0]);
    }
  };

    const{backendUrl,aToken}=useContext(AdminContext)
    
    // You can add your API call here
    const onSubmitHandler = async (event)=>{
        event.preventDefault()
        try{

            if(!docImg){
                return toast.error('Image Not Selected')
            }
         
           const formData = new FormData()

           formData.append('image',docImg)
           formData.append('name',name)
           formData.append('email',email)
           formData.append('password',password)
           formData.append('experience',experience)
           formData.append('fees',Number(fees))
           formData.append('about',about)
           formData.append('speciality',speciality)
           formData.append('degree',degree)
           
           formData.forEach((value,key)=>{
               console.log(`${key}:${value}`);
           })
          
           const{data}=await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers:{aToken}})

           if(data.success)
           {
            toast.success(data.message)
            setDocImg(false)
            setName("")
            setEmail("")
            setPassword("")
            setExperience("1 Year")
            setFees("")
            setAbout("")
            setDegree("")
            setSpeciality("General Physician")
           }else
           {
            toast.error(data.message)
           }

        } catch(error){
              toast.error(error.message)  
              console.log(error)
        }  
    }

  return (
    <div className="w-[70%] ml-[max(5vw,25px)] mt-[50px] text-[#6d6d6d] text-[16px]">
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-[10px]">
        <p className="text-[24px] font-semibold text-black">Add Doctor</p>
        <div className="flex gap-[40px]">
          <div className="flex flex-col gap-[20px] flex-1">
            <div className="flex items-center gap-[20px] border border-gray-300 p-[10px] rounded-[5px]">
              <label htmlFor="doc-img">
                {docImg ? (
                  <img
                    src={URL.createObjectURL(docImg)}
                    alt="preview"
                    className="w-[50px] h-[50px] object-cover rounded-full cursor-pointer"
                  />
                ) : (
                  <img
                    src={assets.upload_area}
                    alt="upload"
                    className="w-[50px] h-[50px] cursor-pointer"
                  />
                )}
              </label>
              <input type="file" id="doc-img" hidden accept="image/*" onChange={handleImageChange} />
              <p className="text-[#6d6d6d]">Upload doctor <br /> picture</p>
            </div>
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">Doctor name</p>
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">Doctor Email</p>
              <input
                type="email"
                placeholder="Your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">Doctor Password</p>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">Experience</p>
              <select
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">Fees</p>
              <input
                type="number"
                placeholder="Your fees"
                required
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">About me</p>
              <textarea
                placeholder="write about yourself"
                rows={5}
                required
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col gap-[20px] flex-1">
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">Speciality</p>
              <select
                name="speciality"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-col gap-[5px]">
              <p className="mb-[5px] text-[14px]">Education</p>
              <input
                type="text"
                placeholder="Education"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="p-[10px] rounded-[5px] border border-gray-300 w-full box-border outline-none"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="max-w-[150px] p-[10px_20px] border-none bg-[#4a00e0] text-white cursor-pointer rounded-[5px] mt-[20px]"
        >
          Add doctor
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;