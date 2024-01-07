import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail } from "../../helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { login } from "../../redux/slices/authSlice";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signinDetails, setSigninDetails] = useState({
    email: "",
    password: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSigninDetails({
      ...signinDetails,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    console.log(signinDetails);
    if (!signinDetails.email || !signinDetails.password) {
      toast.error("Please fill all the details");
      return;
    }
    if (!isEmail(signinDetails.email)) {
      toast.error("Invalid email provided");
      return;
    }
    console.log(signinDetails);

    const response = await dispatch(login(signinDetails));
    if (response?.payload?.data) {
      navigate("/");
    }
    setSigninDetails({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex h-[100vh] items-center justify-center overflow-x-auto">
        <form
          onSubmit={onFormSubmit}
          noValidate
          className="w-35 flex flex-col justify-center gap-3 rounded-lg p-4 text-white"
        >
          <h1 className="text-center text-2xl font-bold">Login Page</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              onChange={handleUserInput}
              value={signinDetails.email}
              required
              type="text"
              name="email"
              className="border bg-transparent px-2 py-1"
              placeholder="enter your Email..."
              id="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              required
              onChange={handleUserInput}
              value={signinDetails.password}
              type="password"
              name="password"
              className="border bg-transparent px-2 py-1"
              placeholder="enter your Password..."
              id="password"
            />
          </div>
          <button className="mt-2 cursor-pointer bg-yellow-800 py-2 text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-yellow-500">
            Sign In
          </button>
          <p className="text-center">
            Don&apos;t have an account ?{" "}
            <Link to="/register" className="cusror-pointer text-accent">
              Register
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signin;
