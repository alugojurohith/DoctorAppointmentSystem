import React from "react";

const About = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6 md:px-20">
      {/* About Us Header */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-blue-700">About Us</h1>
        <p className="mt-4 text-lg text-gray-700">
          We are committed to providing the best healthcare services by
          connecting you with top specialists. Our platform ensures seamless
          appointments, quality consultations, and trusted medical expertise.
        </p>
      </div>
      
      {/* Mission Section */}
      <div className="mt-12 max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-blue-700">Our Mission</h2>
        <p className="mt-4 text-gray-700">
          Our mission is to make healthcare accessible and efficient by
          leveraging technology to bridge the gap between patients and
          healthcare professionals. We strive to offer a user-friendly
          experience with verified specialists, transparent fees, and quick
          booking options.
        </p>
      </div>
      
      {/* Vision Section */}
      <div className="mt-12 max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-blue-700">Our Vision</h2>
        <p className="mt-4 text-gray-700">
          We envision a future where quality healthcare is just a click away.
          By integrating modern technology, we aim to empower individuals to
          take charge of their health through seamless online consultations and
          efficient medical services.
        </p>
      </div>

      {/* Contact Info */}
      <div className="mt-12 max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-blue-700">Get In Touch</h2>
        <p className="mt-4 text-gray-700">Phone: +0-000-000-000</p>
        <p className="text-gray-700">Email: greatstackdev@gmail.com</p>
      </div>
    </div>
  );
};

export default About;