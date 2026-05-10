import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  loginUser,
} from "../Services/auth.service";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const data =
        await loginUser({
          email,
          password,
        });

      localStorage.setItem(
        "token",
        data.token
      );

      toast.success(
        "Login Successful"
      );

      navigate("/dashboard");

    }

    catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-[350px] p-6 border rounded-xl shadow bg-white"
      >

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

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
          Login
        </button>


        {/* TOGGLE */}
        <p className="text-sm text-center">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-medium"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Login;