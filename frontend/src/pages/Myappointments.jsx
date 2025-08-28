import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Myappointments = () => {
  const { backendUrl, token, currencySymbol } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const months = [" ","Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setAppointments(Array.isArray(data.appointments) ? data.appointments : [])
      } else {
        toast.error(data.message || 'Failed to fetch appointments')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (slotDate) => {
    if (!slotDate || typeof slotDate !== 'string') return ''
    const parts = slotDate.split('_')
    if (parts.length !== 3) return slotDate
    const [d, m, y] = parts
    const dd = d.padStart(2, '0')
    const mm = m.padStart(2, '0')
    return `${dd}/${mm}/${y}`
  }

  const getStatusLabel = (appt) => {
    if (appt.cancelled) return 'Cancelled'
    if (appt.isCompleted) return 'Completed'
    if (appt.payment) return 'Paid'
    return 'Scheduled'
  }

  useEffect(() => {
    if (!token) {
      toast.warn('Login to view appointments')
      navigate('/login')
      return
    }
    getUserAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (loading) {
    return <div className='text-center text-gray-500 py-10'>Loading your appointments...</div>
  }

  if (!appointments.length) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-600'>No appointments found.</p>
        <button
          onClick={() => navigate('/doctors')}
          className='mt-4 bg-primary text-white text-sm font-light px-6 py-2 rounded-full'
        >
          Book an appointment
        </button>
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto p-4'>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>My Appointments</h2>

      <div className='space-y-4'>
        {appointments.map((appt) => (
          <div
            key={appt._id}
            className='flex items-center gap-4 border border-gray-200 rounded-lg p-4 bg-white'
          >
            <img
              src={appt?.docData?.image}
              alt={appt?.docData?.name || 'doctor'}
              className='w-16 h-16 rounded-md object-cover bg-gray-100'
            />

            <div className='flex-1 min-w-0'>
              <p className='text-gray-900 font-medium truncate'>
                {appt?.docData?.name || 'Doctor'}
              </p>
              <p className='text-sm text-gray-600 truncate'>
                {appt?.docData?.degree ? `${appt.docData.degree} · ` : ''}
                {appt?.docData?.speciality || ''}
              </p>
              <div className='mt-2 text-sm text-gray-600 flex flex-wrap gap-4'>
                <span>
                   <span className='text-gray-800'>Date & Time:</span><span>{slotDateFormat(appt.slotDate)} | {appt.slotTime}</span>
                </span>
                <div>
                <span>
                  Fee: <span className='text-gray-800'>{currencySymbol}{appt.amount}</span>
                </span>
                 </div>
              </div>
            </div>

            <div>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  appt.cancelled
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : appt.isCompleted
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : appt.payment
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}
              >
                {getStatusLabel(appt)}
              </span>
            </div>
            <div className='flex felx-col gap-2 justify-end'>
               <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
               <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Myappointments