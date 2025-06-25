import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors,changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group p-3"
          >
            <img
            src={item.image}
            alt={item.name}
            className="w-full h-32 object-cover rounded bg-indigo-50 group-hover:bg-primary transition-all duration-500"
            />

            <div className="mt-2">
              <p className="font-semibold text-indigo-700">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
              <div className="mt-2 flex items-center space-x-2">
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available}/>
                <p className="text-sm">{item.available ? "Available" : "Unavailable"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
