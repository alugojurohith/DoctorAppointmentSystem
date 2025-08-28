import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointments = () => {

  const {docId} = useParams()
  const {doctors, currencySymbol,backendUrl,token,getDoctorsData}=useContext(AppContext)
  const daysofweek = ['sun','mon','tue','wed','thu','fri','sat']

  const navigate=useNavigate()

  const [docInfo,setDocInfo]=useState(null)

  const [docslots,setDocSlots] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')
  const [localBooked,setLocalBooked] = useState({}) // in-session + persisted booked slots

  const LOCAL_KEY_PREFIX = 'bookedSlots::'

  const fetchDocInfo =async () =>
  {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  const readLocalBooked = (doctorId) => {
    try{
      const raw = localStorage.getItem(LOCAL_KEY_PREFIX + doctorId)
      if(!raw) return {}
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
      return {}
    }catch(e){
      return {}
    }
  }

  const writeLocalBooked = (doctorId, map) => {
    try{
      localStorage.setItem(LOCAL_KEY_PREFIX + doctorId, JSON.stringify(map))
    }catch(e){
      // ignore storage errors
    }
  }

  // Merge backend-provided map (if any) with locally booked slots
  const getBookedMap = () => {
    const merged = {}
    if (docInfo && docInfo.slots_booked && typeof docInfo.slots_booked === 'object') {
      Object.keys(docInfo.slots_booked).forEach(d => {
        merged[d] = Array.isArray(docInfo.slots_booked[d]) ? [...docInfo.slots_booked[d]] : []
      })
    }
    Object.keys(localBooked).forEach(d => {
      if (!merged[d]) merged[d] = []
      merged[d] = Array.from(new Set([...merged[d], ...localBooked[d]]))
    })
    return merged
  }

  const isSlotBooked = (slotDate, time) => {
    const map = getBookedMap()
    return !!(map[slotDate] && map[slotDate].includes(time))
  }

  const getAvalilableslots= async () =>{
     setDocSlots([])

     //getting current date
     let today=new Date()

     const bookedMap = getBookedMap()

     for(let i=0 ;i<7;i++)
     {
      let currentDate=new Date(today)
      currentDate.setDate(today.getDate()+i)
      let endTime=new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      if(today.getDate()=== currentDate.getDate())
      {
        currentDate.setHours(currentDate.getHours()>10?currentDate.getHours() + 1 :10)
        currentDate.setMinutes(currentDate.getMinutes()>30?30:0)
      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeslots= []

      while(currentDate < endTime)
      {
        let formattedTime = currentDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })

        let day=currentDate.getDate();
        let month=currentDate.getMonth()+1;
        let year=currentDate.getFullYear();

        const slotDate=day + "_" + month + "_" + year

        const available = !(bookedMap[slotDate] && bookedMap[slotDate].includes(formattedTime))
        if(available){
          timeslots.push({
            datetime : new Date(currentDate),
            time : formattedTime
          })
        }
        currentDate.setMinutes(currentDate.getMinutes()+30)
      }
      setDocSlots(prev => ([...prev,timeslots]))
     }
  }

  const bookAppointment =async()=>
  {
    if(!token)
    {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    try{
        if (!docslots.length || !docslots[slotIndex] || !docslots[slotIndex].length) {
          toast.error('No available slots for this date')
          return
        }

        const date=docslots[slotIndex][0].datetime

        let day=date.getDate()
        let month=date.getMonth()+1
        let year=date.getFullYear()

        const slotDate=day + "_" + month + "_" + year

        if(!slotTime){
          toast.error('Please select a time slot')
          return
        }

        // Final guard: prevent booking if just became unavailable
        if (isSlotBooked(slotDate, slotTime)){
          toast.error('Slot not available')
          return
        }

        const {data}= await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{Authorization: `Bearer ${token}`}})
        if(data.success){
          toast.success(data.message)
          getDoctorsData()
          // Update local map and persist
          setLocalBooked(prev => {
            const next = { ...prev }
            if(!next[slotDate]) next[slotDate] = []
            if(!next[slotDate].includes(slotTime)) next[slotDate].push(slotTime)
            // persist
            writeLocalBooked(docId, next)
            return next
          })
          // Regenerate available slots to reflect booking
          getAvalilableslots()
          navigate('/my-appointments')
        }else{
          toast.error(data.message)
        }
    }
    catch(error)
    {
      console.log(error)
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error.message)
      } 
    }
  }

  const handleSlotIndexChange = (index) => {
    setSlotIndex(index)
    setSlotTime('')
  }

  useEffect(()=>{
   fetchDocInfo()
  },[doctors,docId])

  // hydrate localBooked from localStorage whenever doctor changes
  useEffect(()=>{
    if (docId){
      const stored = readLocalBooked(docId)
      setLocalBooked(stored)
    }
  },[docId])

  useEffect(()=>{
     getAvalilableslots()
  },[docInfo, localBooked])

  useEffect(()=>{
    console.log(docslots)
  },[docslots])

  if (!docInfo) {
    return <div>Loading doctor information...</div>
  }

  return (
    <div>
      {/* doctor details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
         <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt=""/>
         </div>
        
          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
           {/* doc Info */}
           <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
             {docInfo.name} 
             <img className='w-5' src={assets.verified_icon} alt="" />
           </p>
           <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
             <p>{docInfo.degree} - {docInfo.speciality}</p>
             <button className='py-0.5 px-2 border text-xs rounded-full '>{docInfo.experience}</button>
           </div>
           {/* doctot about  */}
           <div>
             <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
               About <img src={assets.info_icon} alt=""/>
               </p>
             <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
           </div>
           <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
           </p>
          </div>
          </div>

          {/* booking slots  */}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docslots.length && docslots.map((item,index)=>(
                <div onClick={()=>handleSlotIndexChange(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' :'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysofweek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>
         <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docslots.length && docslots[slotIndex] && docslots[slotIndex].map((item,index)=>(
              <p 
                onClick={()=>setSlotTime(item.time)} 
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'
                }`} 
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          }
         </div>
          <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
        </div>
             {/* related doctor list */}
             {docInfo && <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>}
        
    </div>
  )
}

export default Appointments