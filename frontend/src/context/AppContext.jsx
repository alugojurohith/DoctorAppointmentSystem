import React, { createContext, useState } from 'react';
import { doctors } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors data:", error);
    }
  };

  const value = {
    doctors,
    currencySymbol,
   token,setToken,backendUrl
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