import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { isEmail, isValidPassword } from "../../helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { createAccount } from "../../redux/slices/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signupDetails, setSignupDetails] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupDetails({
      ...signupDetails,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (
      !signupDetails.email ||
      !signupDetails.password
    ) {
      toast.error("Please fill all the details");
      return;
    }

    if (!isEmail(signupDetails.email)) {
      toast.error("Invalid email provided");
      return;
    }
    if (!isValidPassword(signupDetails.password)) {
      toast.error(
        "Invalid password provided, password should 6-16 character long with atleast a number and a special character"
      );
      return;
    }

    const response = await dispatch(createAccount(signupDetails));
    if (response?.payload?.success) {
      navigate("/");
      // Clear form
      setSignupDetails({
        email: "",
        password: "",
      });
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen bg-[#141414]">
        <form
          onSubmit={onFormSubmit}
          noValidate
          className="flex flex-col justify-center gap-5 rounded-2xl p-8 text-white w-full max-w-md bg-zinc-900/50 border border-zinc-800 shadow-2xl backdrop-blur-sm"
        >
          <div className="text-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">Create Account</h1>
            <p className="text-zinc-400 text-sm mt-2 font-medium">Join us to start your journey</p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold text-zinc-300 ml-1 text-sm uppercase tracking-wide">Email</label>
              <input
                onChange={handleUserInput}
                value={signupDetails.email}
                required
                type="email"
                name="email"
                className="bg-zinc-800 text-white px-4 py-3.5 rounded-lg border border-zinc-700 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-zinc-500"
                placeholder="Enter your email"
                id="email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-semibold text-zinc-300 ml-1 text-sm uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  required
                  onChange={handleUserInput}
                  value={signupDetails.password}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full bg-zinc-800 text-white px-4 py-3.5 rounded-lg border border-zinc-700 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-zinc-500 pr-12"
                  placeholder="Enter your password"
                  id="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button className="mt-4 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black py-3.5 rounded-lg text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 active:scale-95 uppercase tracking-wide">
            Create Account
          </button>

          <p className="text-center text-zinc-400 text-sm font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-bold hover:underline transition-all">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Register;
