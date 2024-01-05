import React from "react";
import VideoPlayer from "../../Components/VideoPlayer";
import { useLocation } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { AiOutlineDownload } from "react-icons/ai";

export default function MovieDescription() {
  const { state } = useLocation();
  const trailer = `${state.trailer}?f_auto=mp4`;
  const movie = `${state.sample_video}?f_auto=mp4`;
  const thumbnail = state.thumbnail;
  const title = state.title;
  const description = state.description;
  const duration = state.duration_minutes;
  const genre = state.genres;

  const handleDownload = async () => {
    try {
      // Replace 'CLOUDINARY_VIDEO_URL' with your actual Cloudinary video URL
      const videoUrl = movie;

      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Create a Blob URL for the video
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement("a");
      // Set the href attribute with the Blob URL
      link.href = blobUrl;
      // Specify the filename for the download
      link.download = title;
      // Append the link to the document
      document.body.appendChild(link);
      // Trigger a click on the link to start the download
      link.click();
      // Remove the link from the document
      document.body.removeChild(link);

      // Revoke the Blob URL to free up resources
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] px-4 pt-[70px] grid lg:grid-cols-3 sm:grid-cols-1 gap-8 px-2">
        <div className="px-12 items-center flex flex-col gap-10  text-white lg:col-span-2 ">
          <VideoPlayer trailer={trailer} thumbnail={thumbnail} />
          <button
            className="bg-yellow-500 px-9 py-3 rounded-md flex text-center gap-1 justify-center align-middle text-white font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300 "
            onClick={handleDownload}
          >
            <div className="text-xl">Download</div>
            <div className="mt-1 font-bold text-2xl">
              <AiOutlineDownload />
            </div>
          </button>
        </div>
        <div className="mt-2">
          <img
            src={thumbnail}
            alt={title}
            className=" border border-opacity-75 shadow-md ring ring-white ring-opacity-75 ml-1 mb-5 "
          />
          <h1 className="text-5xl mb-3 text-yellow-500 font-normal  ">
            {title}
          </h1>
          <p className="text-[16px]">{description}</p>
          <div className="flex flex-row justify-between mt-4 mb-5 sm: flex-col gap-1.5 ">
            <p>
              <span className="text-yellow-300 font-normal">Genre</span>
              {` : ${genre}`}
            </p>
            <p>
              <span className="text-yellow-300 font-normal">Duration</span>
              {`: ${duration} min`}
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
