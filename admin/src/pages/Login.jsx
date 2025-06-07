import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Login = () => {
  const [state, setState] = useState('Admin');

  return (
    <form className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p><span className="font-semibold">{state}</span> Login</p>

        <div className="w-full">
          <p className="mb-1">Email</p>
          <input
            type="email"
            required
            className="w-full border px-3 py-2 rounded outline-none focus:border-gray-400"
          />
        </div>

        <div className="w-full">
          <p className="mb-1">Password</p>
          <input
            type="password"
            required
            className="w-full border px-3 py-2 rounded outline-none focus:border-gray-400"
          />
        </div>

        <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
