import React from "react";
import Typewriter from "typewriter-effect";
import HomeLayout from "../Layouts/HomeLayout";
import { Link } from "react-router-dom";
import hero from "../assets/hero-bg.jpg";

export default function Home() {
  return (
    <>
      <HomeLayout>
        <div
          className="flex h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero})`,
          }}
        >
          <div className="mx-16 flex w-1/2 items-center justify-center pr-4 text-stone-200 ">
            <div>
              <h1 className="mb-6 text-4xl font-semibold lg:text-5xl">
                {" "}
                <span className="mb-2 font-bold text-yellow-500">
                  <Typewriter
                    options={{
                      strings: ["Discover", "Download"],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </span>
                BLOCKBUSTER
              </h1>
              <p className="text-xl text-gray-50">
                Movie Magic Anytime, Anywhere—Your Ultimate Gateway to
                Entertainment Delight!
              </p>
              <p className="hidden text-xl text-gray-100 lg:block">
                Unlock the Cinematic Universe: Stream, Download, and Dive into
              </p>

              <div className="mt-6 flex space-x-6">
                <Link to="/movies">
                  <button className="  cursor-pointer rounded-md bg-yellow-500 px-3  py-3 text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-yellow-600 lg:px-5 lg:py-3 ">
                    <span className=" hidden lg:inline-block">Explore</span>{" "}
                    Movies
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="cursor-pointer rounded-md border border-yellow-500 px-5 py-3 text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-yellow-600">
                    Contact <span className="hidden lg:inline-block">Us</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">{/* Additional content here */}</div>
        </div>
      </HomeLayout>
    </>
  );
}
