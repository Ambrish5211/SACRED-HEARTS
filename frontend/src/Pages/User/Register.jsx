import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail, isValidPassword } from "../../helpers/regexMatcher";
import HomeLayout from "../../Layouts/HomeLayout";
import { createAccount } from "../../redux/slices/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signupDetails, setSignupDetails] = useState({
    email: "",
    username: "",
    password: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupDetails({
      ...signupDetails,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    console.log(signupDetails);
    if (
      !signupDetails.email ||
      !signupDetails.password ||
      !signupDetails.username
    ) {
      toast.error("Please fill all the details");
      return;
    }
    if (signupDetails.username.length < 5) {
      toast.error("Name should be atleast of 5 characters");
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

    const formData = new FormData();
    formData.append("username", signupDetails.username);
    formData.append("email", signupDetails.email);
    formData.append("password", signupDetails.password);

    const response = await dispatch(createAccount(signupDetails));
    if (response?.payload?.data) {
      navigate("/");
    }
    setSignupDetails({
      email: "",
      username: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          noValidate
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-35"
        >
          <h1 className="text-2xl text-center font-bold">Registration Page</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-semibold">
              Name
            </label>
            <input
              onChange={handleUserInput}
              value={signupDetails.username}
              required
              type="text"
              name="username"
              className="bg-transparent px-2 py-1 border"
              placeholder="enter your username..."
              id="username"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              onChange={handleUserInput}
              value={signupDetails.email}
              required
              type="text"
              name="email"
              className="bg-transparent px-2 py-1 border"
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
              value={signupDetails.password}
              type="password"
              name="password"
              className="bg-transparent px-2 py-1 border"
              placeholder="enter your Password..."
              id="password"
            />
          </div>
          <button className="mt-2 bg-yellow-800 hover:bg-yellow-500 transition-all ease-in-out duration-300 cursor-pointer py-2 font-semibold text-lg">
            Create account
          </button>
          <p className="text-center">
            Already have an account ?{" "}
            <Link to="/login" className="cusror-pointer text-accent">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Register;
