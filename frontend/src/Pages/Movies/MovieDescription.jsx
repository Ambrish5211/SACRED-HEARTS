import React from "react";
import VideoPlayer from "../../Components/VideoPlayer";
import { useLocation } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { AiOutlineDownload } from "react-icons/ai";

export default function MovieDescription() {
  const { state } = useLocation();
  const trailer = `${state.videoFile}?f_auto=mp4`;
  const movie = `${state.videoFile}?f_auto=mp4`;
  const thumbnail = state.thumbnail;
  const title = state.title;
  const description = state.description;
  const duration = Math.round(state.duration);
  const genre = state.genre.toUpperCase();

  const handleDownload = async () => {
    try {
      const videoUrl = movie;

      const response = await fetch(videoUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  return (
    <HomeLayout>
      <div className="grid min-h-[100vh] w-full  pt-[70px] sm:pt-[70px] md:grid-cols-3 ">
        <div className="flex flex-col items-center gap-10 px-2 text-white md:col-span-2 md:px-12 ">
          <VideoPlayer trailer={trailer} thumbnail={thumbnail} />
          <button
            className="flex cursor-pointer justify-center gap-1 rounded-md bg-yellow-500 px-9 py-3 text-center align-middle text-lg font-semibold text-white transition-all duration-300 ease-in-out hover:bg-yellow-600  "
            onClick={handleDownload}
          >
            <div className="text-xl">Download</div>
            <div className="mt-1 text-2xl font-bold">
              <AiOutlineDownload />
            </div>
          </button>
        </div>
        <div className="mx-2 mt-8 pr-2 md:mx-0 md:mt-2 ">
          <img
            src={thumbnail}
            alt={title}
            className=" mb-5  hidden h-64 max-h-full  w-full border border-opacity-75 shadow-md ring ring-white ring-opacity-75 lg:block"
          />
          <h1 className="mb-6 text-center text-5xl font-semibold  text-yellow-500  lg:mb-3 lg:text-left lg:font-normal ">
            {title}
          </h1>
          <p className="px-2 text-[16px] sm:px-0">{description}</p>
          <div className="mb-5 mt-4 flex flex-col   justify-between gap-1.5 px-2 sm:px-0 ">
            <p>
              <span className="font-normal text-yellow-300">Genre</span>
              {` : ${genre}`}
            </p>
            <p>
              <span className="font-normal text-yellow-300">Duration</span>
              {`: ${duration} min`}
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
