import React, { useContext, useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { specialityData } from '../assets/assets';

const Doctors = () => {
   
  const {speciality} =useParams()
  const [filterDoc,setFilterDoc] = useState([])

  const {doctors} = useContext(AppContext)
  const navigate=useNavigate();

  const applyFilter = () => {
    if(speciality)  {
      setFilterDoc(doctors.filter(doc =>doc.speciality === speciality))
    }
    else{
      setFilterDoc(doctors)
    }
  }

  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])

  const handleSpecialityClick = (spec) => {
    navigate(`/doctors/${spec}`);
  }

  return(
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          {specialityData.map((item, index) => (
            <p 
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-indigo-50 ${item.speciality === speciality ? 'bg-indigo-100 text-black' : ''}`} 
              key={index} 
              onClick={() => handleSpecialityClick(item.speciality)}
            >
              {item.speciality}
            </p>
          ))}
        </div>
        
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item,index)=>(
              <div onClick={()=>navigate(`/appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" key={index}>
                <img className="bg-blue-50" src={item.image} alt="" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-center text-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p>Available</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                  <p className="text-gray-600 text-lg font-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors;