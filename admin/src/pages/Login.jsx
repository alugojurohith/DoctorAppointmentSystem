
import React, { useContext, useState } from "react";
import {assets} from '../assets/assets'
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      } else {
        // Doctor login logic here
        toast.info("Doctor login not implemented yet.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed!");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full">
          <p className="mb-1">Email</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded outline-none focus:border-gray-400"
          />
        </div>

        <div className="w-full">
          <p className="mb-1">Password</p>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded outline-none focus:border-gray-400"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p>
          {state === "Admin" ? "Doctor" : "Admin"} Login?{" "}
          <span
            className="text-primary underline cursor-pointer"
            onClick={() =>
              setState((prev) => (prev === "Admin" ? "Doctor" : "Admin"))
            }
          >
            Click here
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
