import React from "react";

const Contact = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700">Contact Us</h1>
        <p className="text-gray-700 mt-2">We'd love to hear from you! Get in touch with us for any inquiries.</p>

        <div className="mt-6 text-left">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Phone</h2>
            <p className="text-gray-700">+0-000-000-000</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Email</h2>
            <p className="text-gray-700">greatstackdev@gmail.com</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Address</h2>
            <p className="text-gray-700">123, Health Street, MedCity, Country</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;