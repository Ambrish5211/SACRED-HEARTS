import React, { useState, useEffect, useRef } from "react";
import heroBg from "../assets/hero-bg.jpg";
import hobbit from "../assets/hobbit.jpg";
import interstellar from "../assets/interstellar.jpg";
import theBossBaby from "../assets/the-boss-baby.jpg";
import HomeLayout from "../Layouts/HomeLayout";


const carouselImages = [heroBg, hobbit, interstellar, theBossBaby];

function About() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  return (
    <HomeLayout>
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-start pb-20 w-full">
        {/* Hero Section - Full Width and Height */}
        <div className="w-full relative overflow-hidden shadow-2xl bg-zinc-800/90 mb-10 flex items-center justify-center h-screen">
          <img
            src={heroBg}
            alt="About Us Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-16 md:py-24 text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg mb-6 uppercase tracking-widest w-full">
              About Sacred Hearts
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 font-medium max-w-3xl mx-auto mb-6">
              Welcome to <span className="text-yellow-300 font-bold">Sacred Hearts</span>, your ultimate destination for cinematic discovery and entertainment. We are dedicated to bringing you a handpicked selection of movies, from timeless classics to the latest blockbusters, all in a visually stunning and user-friendly environment.<br/><br/>
              Our platform is more than just a movie site—it's a vibrant community where film lovers connect, share, and celebrate the magic of storytelling. Whether you're seeking inspiration, nostalgia, or the thrill of something new, Sacred Hearts is your home for unforgettable movie nights.
            </p>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
              Explore curated collections, enjoy seamless navigation, and join a passionate community of film enthusiasts. At Sacred Hearts, every movie night is a special experience.
            </p>
          </div>
        </div>

        {/* Carousel and Our Vision Side by Side */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 mb-16 px-2 md:px-4">
          {/* Carousel - Bigger */}
          <div className="flex-1 relative w-full">
            <div className="relative h-80 md:h-[500px] overflow-hidden rounded-lg shadow-lg bg-zinc-800/80">
              {carouselImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${current === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  style={{ pointerEvents: current === idx ? 'auto' : 'none' }}
                >
                  <img
                    src={img}
                    className="block w-full h-full object-cover"
                    alt={`carousel-${idx}`}
                  />
                </div>
              ))}
            </div>
            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-3 h-3 rounded-full ${current === idx ? 'bg-yellow-400' : 'bg-zinc-700'}`}
                  aria-current={current === idx}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </div>
            {/* Slider controls */}
            <button
              type="button"
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={prevSlide}
              aria-label="Previous"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={nextSlide}
              aria-label="Next"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
          {/* Our Vision Card */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full bg-gradient-to-tr from-yellow-500/10 to-zinc-800/80 rounded-xl shadow-2xl border border-yellow-500 p-8 md:p-12 flex flex-col items-center justify-center text-center min-h-[20rem]">
              <h3 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-4 uppercase tracking-wide drop-shadow-lg">Our Vision</h3>
              <p className="text-slate-200 text-lg md:text-xl mb-4 leading-relaxed font-medium">
                To be the most loved and trusted platform for movie discovery and enjoyment, where every user feels at home and inspired by the world of cinema.<br/><br/>
                We envision Sacred Hearts as a place where stories come alive, friendships are formed, and every movie night is magical. Our commitment is to innovation, inclusivity, and a seamless, ad-free experience for all.
              </p>
              <p className="text-yellow-300 font-semibold text-lg">Let's make movie nights magical together!</p>
            </div>
          </div>
        </div>

        {/* About Content (unchanged) */}
        <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-zinc-800/90 to-zinc-700/80 rounded-xl shadow-2xl p-10 text-center mb-16 border border-zinc-700">
          <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-6 uppercase tracking-wide drop-shadow-lg">Our Story</h2>
          <p className="text-slate-200 text-lg md:text-xl mb-6 leading-relaxed font-medium">
            Sacred Hearts was founded by a passionate group of movie lovers who wanted to create a space where film enthusiasts could come together and celebrate the art of cinema. Our journey began with a simple idea: to make discovering and enjoying movies effortless, beautiful, and social.<br/><br/>
            Over the years, we've grown into a vibrant community, curating collections that span genres, eras, and cultures. We believe in the power of storytelling to inspire, connect, and transform lives. Our platform is designed to be intuitive, visually stunning, and packed with features to help you find your next favorite film.
          </p>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-8">
            <div className="flex-1 bg-zinc-900/80 rounded-lg p-6 shadow-md border border-zinc-700">
              <h3 className="text-2xl font-bold text-yellow-300 mb-3 uppercase tracking-wide">Why Choose Us?</h3>
              <ul className="text-slate-300 text-base list-disc list-inside mb-4 text-left mx-auto max-w-xs">
                <li>Curated movie collections for every taste</li>
                <li>Modern, beautiful, and responsive UI</li>
                <li>Easy navigation and advanced search</li>
                <li>Regularly updated with new releases</li>
                <li>Passionate community of film enthusiasts</li>
                <li>Personalized recommendations</li>
                <li>Ad-free, seamless experience</li>
              </ul>
              <p className="text-slate-400 italic text-sm">Join us and experience movies like never before!</p>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default About;