import React, { useState } from 'react';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // TODO: add submit logic (API call, auth, etc.)
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[420px] border rounded-xl text-zinc-600 text-sm shadow-lg ">
        {/* Header */}
        <p className="text-2xl font-semibold">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {/* Full Name (only for Sign Up) */}
        {state === 'Sign Up' && (
          <div className="w-full">
            <p className="mb-1">Full Name</p>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        {/* Email */}
        <div className="w-full">
          <p className="mb-1">Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p className="mb-1">Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {/* Toggle link */}
        {state === 'Sign Up' 
          ? (
            <p className="mt-2 text-sm">
              Already have an Account?{' '}
              <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">
                Login here
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm">
              Create an account?{' '}
              <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">
                click here
              </span>
            </p>
          )
        }
      </div>
    </form>
  );
};

export default Login;