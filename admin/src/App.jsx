
import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./context/AppContext";
import Navbar from "./components/NavBar";

const App = () => {
  const { aToken } = useContext(AppContext);

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
    <Navbar/>
      <ToastContainer />
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
