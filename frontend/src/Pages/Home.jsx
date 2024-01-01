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
          <div className="w-1/2 flex items-center justify-center text-white mx-16 ">
            <div>
              <h1 className="text-5xl font-semibold mb-6">
                {" "}
                <span className="text-yellow-500 font-bold mb-2">
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
              <p className="text-xl text-gray-200">
                Unlock the Cinematic Universe: Stream, Download, and Dive into
                Movie Magic Anytime, Anywhere—Your Ultimate Gateway to
                Entertainment Delight!
              </p>

              <div className="space-x-6 mt-6">
                <Link to="/movies">
                  <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                    Explore Movies
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
          {/* Additional content for the right side */}
          <div className="w-1/2">{/* Add your additional content here */}</div>
        </div>
      </HomeLayout>
    </>
  );
}
