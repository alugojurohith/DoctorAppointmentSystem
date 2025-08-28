import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Myprofile = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    image: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({});

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error('Please login first');
        return;
      }
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (data.success) {
          setUserData(data.user);
          setFormState({ ...data.user });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to fetch profile data');
      }
    };
    fetchProfile();
  }, [token, backendUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState(prev => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login first');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('phone', formState.phone);
      formData.append('dob', formState.dob);
      formData.append('gender', formState.gender);
      if (formState.imageFile) {
        formData.append('image', formState.imageFile);
      }
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (data.success) {
        toast.success('Profile updated successfully!');
        // Refresh profile data
        const profileResponse = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (profileResponse.data.success) {
          setUserData(profileResponse.data.user);
          setFormState({ ...profileResponse.data.user });
        }
        setEditMode(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Login First</h2>
          <p className="text-gray-600">You need to be logged in to view and update your profile.</p>
        </div>
      </div>
    );
  }

  // VIEW MODE
  if (!editMode) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-3">
              {userData.image ? (
                <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
              )}
            </div>
            <div className="text-xl font-semibold mb-1">{userData.name || 'No Name'}</div>
          </div>
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 mb-1">CONTACT INFORMATION</div>
            <div className="mb-1"><span className="font-semibold">Email id:</span> <span className="text-blue-700">{userData.email || '-'}</span></div>
            <div className="mb-1"><span className="font-semibold">Phone:</span> <span>{userData.phone || '-'}</span></div>
          </div>
          <div className="mb-6">
            <div className="text-xs font-bold text-gray-500 mb-1">BASIC INFORMATION</div>
            <div className="mb-1"><span className="font-semibold">Gender:</span> <span>{userData.gender || '-'}</span></div>
            <div className="mb-1"><span className="font-semibold">Birthday:</span> <span>{userData.dob || '-'}</span></div>
          </div>
          <button
            className="w-full py-2 px-4 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  // EDIT MODE
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
              {formState.image ? (
                <img 
                  src={formState.imageFile ? URL.createObjectURL(formState.imageFile) : formState.image} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formState.name || ''}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formState.email || ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formState.phone || ''}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formState.dob || ''}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formState.gender || ''}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              className="w-1/2 py-3 px-4 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium"
              onClick={() => { setEditMode(false); setFormState({ ...userData }); }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 py-3 px-4 rounded-md text-white font-medium ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Myprofile;
