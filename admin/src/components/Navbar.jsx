import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import AdminContext from '../context/AdminContext';

const NavBar = () => {
  const { aToken, setAToken } = useContext(AdminContext);

  const logout = () => {
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
  };

  return (
    <div class="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div class="flex items-center gap-2 text-xs">
        <img class="w-36 sm:w-40 cursor-pointer" src={assets.admin_logo} alt="" />
      </div>
    </div>
  );
};

export default NavBar;
