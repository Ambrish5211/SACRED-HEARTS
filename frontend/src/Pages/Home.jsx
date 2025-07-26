import React from "react";
import Typewriter from "typewriter-effect";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import hero from "../assets/hero-bg.jpg";
import hero2 from "../assets/top-rated-bg.jpg";
import hero3 from "../assets/cta-bg.jpg";
import bossbabyImg from "../assets/the-boss-baby.jpg";
import interstellarImg from "../assets/interstellar.jpg";
import hobbitImg from "../assets/hobbit.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <HomeLayout>
        <main
          className="max-w-screen"
          style={{
            backgroundImage: `url(${hero})`,
            backgroundSize: "cover",
          }}
        >
          <section className="mx-auto flex h-screen max-w-[85rem] items-center ">
            <div className="  p-2  text-stone-200 sm:pt-6 ">
              <h1 className="max-w-md text-center text-4xl font-semibold sm:text-left sm:text-5xl">
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
              <p className="max-w- mt-6 text-center text-xl text-slate-50 sm:text-left sm:text-xl">
                Movie Magic Anytime, Anywhere—Your Ultimate Gateway to
                Entertainment <br /> Delight!
              </p>
              <p className=" hidden max-w-md text-center text-xl sm:block  sm:text-left">
                Unlock the Cinematic Universe: Stream, Download, and Dive
                into...
              </p>
              <div className="mt-6 flex justify-center space-x-6 sm:justify-start">
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
          </section>
        </main>

        <main
          className="max-w-screen"
          style={{
            backgroundImage: `url(${hero2})`,
            backgroundSize: "cover",
          }}
        >
          <section className="max-w-7.2xl mx-auto p-12">
            <div className="text-center">
              <p className="mb-3 mt-9 text-xs font-semibold text-yellow-500">
                ONLINE STREAMING
              </p>
              <h1 className="mb-20 text-4xl font-extrabold uppercase text-slate-100">
                Top Rated Movies
              </h1>
            </div>
            <div className="my-12 flex flex-wrap  items-center justify-between gap-8 sm:px-10 ">
              {/* FIRST MOVIE */}

              <div
                className="h-[430px] w-[22rem] transform cursor-pointer overflow-hidden rounded-lg bg-zinc-700 text-white shadow-lg transition-transform ease-in-out hover:scale-105 "
                onClick={() => navigate(`/movies`)}
              >
                <img
                  alt="Interstellar"
                  src={interstellarImg}
                  className="group:hover:scale=[1,2] h-64 w-full rounded-tl-lg rounded-tr-lg transition-all duration-300 ease-in-out"
                />
                <div className="space-y-3 p-3 text-white ">
                  <h2 className=" line-clamp-2 text-center text-2xl font-bold uppercase text-yellow-500 ">
                    Interstellar
                  </h2>
                  <p className="mt-1 line-clamp-2 font-semibold">
                    Directed By:
                    <span className="font-bold text-yellow-500">
                      {" "}
                      Christopher Nolan
                    </span>
                  </p>
                  <p className=" font-semibold sm:inline-block">
                    Duration: 
                    <span className=" font-bold text-yellow-500 sm:inline-block">
                      {" "}
                       2h 49min
                    </span>
                  </p>
                  <p className=" font-semibold ">
                    Genre:
                    <span className="font-bold text-yellow-500"> SCiFI</span>
                  </p>
                </div>
              </div>

              {/* SECOND MOVIE */}

              <div
                className="h-[430px] w-[22rem] transform cursor-pointer overflow-hidden rounded-lg bg-zinc-700 text-white shadow-lg transition-transform ease-in-out hover:scale-105 "
                onClick={() => navigate(`/movies`)}
              >
                <img
                  alt="thebossbaby"
                  src={bossbabyImg}
                  className="group:hover:scale=[1,2] h-64 w-full  rounded-tl-lg rounded-tr-lg transition-all duration-300 ease-in-out"
                />
                <div className="space-y-3 p-3 text-white ">
                  <h2 className=" line-clamp-2 text-center text-2xl font-bold uppercase text-yellow-500 ">
                    The Boss Baby
                  </h2>
                  <p className="mt-1 line-clamp-2 font-semibold">
                    Directed By:
                    <span className="font-bold text-yellow-500">
                      {" "}
                      Tom McGrath
                    </span>
                  </p>
                  <p className=" font-semibold sm:inline-block">
                    Duration:
                    <span className=" font-bold text-yellow-500 sm:inline-block">
                      {" "}
                       1h 39min
                    </span>
                  </p>
                  <p className=" font-semibold">
                    Genre:
                    <span className="font-bold text-yellow-500"> Comedy</span>
                  </p>
                </div>
              </div>

              {/* THIRD  MOVIE */}

              <div
                className="h-[430px] w-[22rem] transform cursor-pointer overflow-hidden rounded-lg bg-zinc-700 text-white shadow-lg transition-transform ease-in-out hover:scale-105 "
                onClick={() => navigate(`/movies`)}
              >
                <img
                  alt="thehobbit"
                  src={hobbitImg}
                  className="group:hover:scale=[1,2] h-64 w-full  rounded-tl-lg rounded-tr-lg transition-all duration-300 ease-in-out"
                />
                <div className="space-y-3 p-3 text-white ">
                  <h2 className=" line-clamp-2 text-center text-2xl font-bold uppercase text-yellow-500 ">
                    The Hobbit
                  </h2>
                  <p className="mt-1 line-clamp-2 font-semibold">
                    Directed By:
                    <span className="font-bold text-yellow-500">
                      {" "}
                      Peter Jackson
                    </span>
                  </p>
                  <p className=" font-semibold sm:inline-block">
                    Duration:
                    <span className=" font-bold text-yellow-500 sm:inline-block">
                      {" "}
                       2h 38min
                    </span>
                  </p>
                  <p className="font-semibold">
                    Genre:
                    <span className="font-bold text-yellow-500">
                      {" "}
                      Adventure
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <main
          className="max-w-screen"
          style={{
            backgroundImage: `url(${hero3})`,
            backgroundSize: "cover",
          }}
        >
          <div className="mx-auto grid max-w-7xl gap-6 py-12 sm:grid-cols-2 sm:gap-0">
            <div className="flex items-start justify-center sm:flex-col">
              <h1 className="text-xl font-bold uppercase text-stone-800 sm:text-3xl sm:font-extrabold">
                NEVER MISS AN UPDATE FROM US.
              </h1>
              <h2 className="mt-1 hidden font-semibold text-black sm:block">
                Enter your email to get started with us.
              </h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="sm:relative ">
                <input
                  placeholder="Enter your email..."
                  type="email"
                  className="h-8 w-[14rem] rounded-md bg-white px-4 font-semibold text-slate-800 shadow-md sm:h-12 sm:w-[28rem] "
                />
                <button className="sm:bold right-0 ml-2 h-8 w-16 rounded-md bg-black p-2 text-xs font-semibold text-yellow-400 transition ease-in-out hover:bg-yellow-500 hover:text-white sm:absolute sm:ml-0 sm:h-12 sm:w-24">
                  <span className="hidden sm:block">GET STARTED</span>
                  <span className="sm:hidden">Subscribe</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </HomeLayout>
    </>
  );
}
