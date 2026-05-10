import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  registerUser,
} from "../Services/auth.service";

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await registerUser({
        name,
        email,
        password,
      });

      toast.success(
        "Registration Successful"
      );

      navigate("/login");

    }

    catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 w-[350px] p-6 border rounded-xl shadow bg-white"
      >

        <h1 className="text-2xl font-bold text-center">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Register
        </button>


        {/* TOGGLE */}
        <p className="text-sm text-center">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 font-medium"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Register;