import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthFunctions } from "../../hooks/useAuthFunctions";
import Logo from "../../assets/logo.webp";

const Signup = () => {
  const { signUpUser } = useAuthFunctions();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleFormData = async (e) => {
    e.preventDefault();

    try {
      await signUpUser(email, password, fullname);
      console.log("User signed up successfully");
      navigate("/manufacturer-dash", { replace: true });
    } catch (error) {
      console.log("Signup error:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <img alt="Secure Scan" src={Logo} className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-2xl font-semibold text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-400">Sign up to get started</p>
        </div>

        <form className="space-y-6" onSubmit={handleFormData}>
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-300">
              Fullname
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              autoComplete="fullname"
              className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Log in  
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
