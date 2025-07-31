import React, { createContext, useState } from 'react';
import { doctors as staticDoctors } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success && data.doctors.length > 0) {
        setDoctors(data.doctors);
      } else {
        console.log('No doctors from API, using static data');
        setDoctors(staticDoctors);
      }
    } catch (error) {
      console.error("Error fetching doctors data:", error);
      console.log('Using static doctors data as fallback');
      setDoctors(staticDoctors);
      toast.error("Failed to fetch doctors data, using cached data");
    }
  };

  const value = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl
  };
  
  useEffect(() => {
    getDoctorsData(); 
  }, []);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;