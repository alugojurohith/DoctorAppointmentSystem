import React from 'react';
import { doctors, assets } from '../assets/assets'; // Correctly import the data


const Doctors = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-12 text-center">
        <img src={assets.header_img} alt="Header" className="mx-auto mb-6 w-32 h-32 object-contain" />
        <h1 className="text-4xl sm:text-5xl font-bold">Meet Our Doctors</h1>
        <p className="mt-4 text-xl sm:text-2xl">Qualified professionals dedicated to your health and well-being</p>
      </header>

      {/* Doctors List Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-10 text-center">Our Expert Medical Team</h2>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              {/* Doctor Image */}
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-32 sm:h-40 object-cover rounded-t-lg"
              />

              {/* Doctor Info */}
              <div className="p-4 flex flex-col h-full">
                <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                <p className="text-gray-500 mt-2">{doctor.speciality}</p>
                <p className="text-gray-700 mt-4 text-sm flex-grow">{doctor.about}</p>

                {/* Doctor Details */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-gray-700 text-sm">Experience: {doctor.experience} years</p>
                    <p className="text-gray-700 text-sm">Fees: ${doctor.fees}</p>
                  </div>
                  <button className="bg-blue-600 text-white py-2 px-6 rounded-lg text-sm hover:bg-blue-700">
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Doctor Address */}
              <div className="bg-gray-50 p-4">
                <p className="text-gray-600 text-sm">{doctor.address.line1}</p>
                <p className="text-gray-600 text-sm">{doctor.address.line2}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6">
        <p className="text-sm sm:text-base">&copy; 2025 HealthCare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Doctors;
