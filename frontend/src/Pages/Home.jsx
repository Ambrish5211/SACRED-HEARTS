import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../config/axiosInstance";
import MoviesCard from "../Components/MoviesCard";
import hero from "../assets/hero-bg.jpg";
import hero3 from "../assets/cta-bg.jpg";

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    // Top Rated (Public)
    (async () => {
      try {
        const res = await axiosInstance.get("/movies/top-rated-movies");
        if (res?.data?.success) {
          setTopRatedMovies(res.data.data || []);
        }
      } catch (error) {
        console.log("Failed to fetch top rated movies", error);
      }
    })();

    // Recently Watched (Private)
    if (isLoggedIn) {
      (async () => {
        try {
          const res = await axiosInstance.get("/users/recently-watched");
          if (res?.data?.success) {
            // Adjust according to the API response structure observed in logs
            // Assuming res.data.data.user.recentlyWatched based on previous user correction
            setRecentlyWatched(res.data.data.user.recentlyWatched || []);
          }
        } catch (error) {
          console.log("Failed to fetch recently watched", error);
        }
      })();
    }
  }, [isLoggedIn]);

  return (
    <HomeLayout>
      {/* HERO SECTION */}
      <main
        className="max-w-screen h-screen relative"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#141414]"></div>
        <section className="relative mx-auto flex h-full max-w-[85rem] items-center px-6">
          <div className="p-2 text-stone-200 sm:pt-6">
            <h1 className="max-w-2xl text-center text-4xl font-semibold sm:text-left sm:text-6xl leading-tight">
              <span className="mb-2 font-bold text-yellow-500 block">
                <Typewriter
                  options={{
                    strings: ["Discover.", "Stream.", "Experience."],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </span>
              UNLIMITED ENTERTAINMENT
            </h1>
            <p className="mt-6 max-w-xl text-center text-lg text-slate-300 sm:text-left sm:text-2xl font-light">
              Your gateway to the cinematic universe. Watch the latest blockbuster movies anytime, anywhere.
            </p>

            <div className="mt-8 flex justify-center space-x-6 sm:justify-start">
              <Link to="/movies">
                <button className="cursor-pointer rounded-full bg-yellow-500 px-8 py-3 text-lg font-bold text-black transition-all duration-300 hover:bg-yellow-400 hover:scale-105 shadow-lg shadow-yellow-500/30">
                  Explore Movies
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* CONTENT SECTIONS */}
      <div className="bg-[#141414] min-h-screen pb-20 relative z-10 space-y-24">

        {/* RECENTLY WATCHED SECTION */}
        {isLoggedIn && recentlyWatched.length > 0 && (
          <section className="max-w-[85rem] mx-auto px-6 pt-10">
            <div className="text-center mb-16">
              <p className="mb-3 text-xs font-semibold text-yellow-500 uppercase tracking-widest">
                Jump Back In
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider inline-block border-b-4 border-yellow-500 pb-4">
                Continue Watching
              </h2>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-between gap-10">
              {recentlyWatched.slice(0, 3).map((movie) => (
                <div key={movie._id} className="transform hover:scale-105 transition-transform duration-300">
                  <MoviesCard data={movie} />
                </div>
              ))}
              {/* Alignment Fillers for 3-column grid consistency */}
              {recentlyWatched.length < 3 && Array(3 - recentlyWatched.length).fill(0).map((_, i) => (
                <div key={`filler-${i}`} className="w-[18rem] sm:w-[22rem] hidden lg:block h-0"></div>
              ))}
            </div>
          </section>
        )}

        {/* TOP RATED SECTION */}
        <section className={`max-w-[85rem] mx-auto px-6 ${!isLoggedIn || recentlyWatched.length === 0 ? "pt-10" : ""}`}>
          <div className="text-center mb-16">
            <p className="mb-3 text-xs font-semibold text-yellow-500 uppercase tracking-widest">
              Online Streaming
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider inline-block border-b-4 border-yellow-500 pb-4">
              Top Rated Hits
            </h2>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-between gap-10">
            {topRatedMovies && topRatedMovies.length > 0 ? (
              topRatedMovies.slice(0, 3).map((movie) => (
                <div key={movie._id} className="transform hover:scale-105 transition-transform duration-300">
                  <MoviesCard data={movie} />
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-lg w-full text-center">Loading top rated movies...</p>
            )}
            {/* Alignment Fillers */}
            {topRatedMovies.length > 0 && topRatedMovies.length < 3 && Array(3 - topRatedMovies.length).fill(0).map((_, i) => (
              <div key={`filler-tr-${i}`} className="w-[18rem] sm:w-[22rem] hidden lg:block h-0"></div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <Link to="/movies?sort=rating">
              <button className="px-10 py-4 rounded-full border-2 border-yellow-500 text-yellow-500 font-bold hover:bg-yellow-500 hover:text-black transition-all duration-300 uppercase tracking-widest shadow-lg hover:shadow-yellow-500/20">
                View All Top Rated
              </button>
            </Link>
          </div>
        </section>
      </div>

      {/* CTA SECTION */}
      <main
        className="max-w-screen relative"
        style={{
          backgroundImage: `url(${hero3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative mx-auto grid max-w-7xl gap-6 py-20 px-6 sm:grid-cols-2 sm:gap-0 items-center">
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-3xl font-extrabold uppercase text-white sm:text-4xl">
              Stay Updated
            </h1>
            <h2 className="mt-2 text-lg text-zinc-300 font-medium">
              Join our community and never miss a new release.
            </h2>
          </div>
          <div className="flex items-center justify-center sm:justify-end w-full">
            <div className="w-full max-w-md relative flex">
              <input
                placeholder="Enter your email address"
                type="email"
                className="w-full rounded-l-md bg-white/10 backdrop-blur-sm border border-zinc-600 px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button className="rounded-r-md bg-yellow-500 px-6 py-4 font-bold text-black transition hover:bg-yellow-400">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
}
