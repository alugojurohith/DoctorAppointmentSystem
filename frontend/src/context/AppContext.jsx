import React, { createContext, useState } from 'react';
import { doctors as staticDoctors } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
   const [userData, setUserData] = useState(false);
  

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

  const loadUserProfile = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/user/profile',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(data.success && data.user){
        setUserData(data.user);
      }else{
        setUserData(false);
      }
    }catch(error){
      console.error("Error fetching user profile:", error);
      setUserData(false);
      toast.error("Failed to fetch user profile");
    }
  }

  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfile
  };
  
  useEffect(() => {
    getDoctorsData(); 
  }, []);

  useEffect(() => {
    if(token){
      loadUserProfile();
    }else{
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;