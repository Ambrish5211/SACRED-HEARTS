import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { isEmail } from "../../helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { login } from "../../redux/slices/authSlice";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [signinDetails, setSigninDetails] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSigninDetails({
      ...signinDetails,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!signinDetails.email || !signinDetails.password) {
      toast.error("Please fill all the details");
      return;
    }
    if (!isEmail(signinDetails.email)) {
      toast.error("Invalid email provided");
      return;
    }

    const response = await dispatch(login(signinDetails));
    if (response?.payload?.success) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    setSigninDetails({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen bg-[#141414]">
        <form
          onSubmit={onFormSubmit}
          noValidate
          className="flex flex-col justify-center gap-6 rounded-2xl p-8 text-white w-full max-w-md bg-zinc-900/50 border border-zinc-800 shadow-2xl backdrop-blur-sm"
        >
          <div className="text-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-zinc-400 text-sm mt-2 font-medium">Please sign in to continue watching</p>
          </div>

          <div className="flex flex-col gap-5 mt-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold text-zinc-300 ml-1 text-sm uppercase tracking-wide">Email</label>
              <input
                onChange={handleUserInput}
                value={signinDetails.email}
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
                  value={signinDetails.password}
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
                  tabIndex="-1" // prevent tab focus if desired
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button className="mt-4 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black py-3.5 rounded-lg text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 active:scale-95 uppercase tracking-wide">
            Sign In
          </button>

          <p className="text-center text-zinc-400 text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-bold hover:underline transition-all">
              Register
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signin;
