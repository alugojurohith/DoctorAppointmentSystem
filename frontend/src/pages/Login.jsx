import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { token, setToken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      if (state === 'Sign Up') {
        console.log('Registering user:', { name, email });
        const { data } = await axios.post(backendUrl + '/api/user/register', { 
          name, 
          password, 
          email 
        });
        
        console.log('Registration response:', data);
        
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Account created successfully!');
          // Clear form
          setName('');
          setEmail('');
          setPassword('');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      } else {
        console.log('Logging in user:', { email });
        const { data } = await axios.post(backendUrl + '/api/user/login', { 
          email, 
          password 
        });
        
        console.log('Login response:', data);
        
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Login successful!');
          // Clear form
          setEmail('');
          setPassword('');
        } else {
          toast.error(data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

   useEffect(() => {
    if (token) {
      // Redirect to home or another page if already logged in
      navigate('/');
    }
  }, [token]);
  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[420px] border rounded-xl text-zinc-600 text-sm shadow-lg">
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
              disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full mt-4 px-4 py-2 text-white rounded ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (state === 'Sign Up' ? 'Create Account' : 'Login')}
        </button>

        {/* Toggle link */}
        {state === 'Sign Up' 
          ? (
            <p className="mt-2 text-sm">
              Already have an Account?{' '}
              <span 
                onClick={() => setState('Login')} 
                className="text-primary underline cursor-pointer"
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm">
              Create an account?{' '}
              <span 
                onClick={() => setState('Sign Up')} 
                className="text-primary underline cursor-pointer"
                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
              >
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