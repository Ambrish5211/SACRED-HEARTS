import React from "react";
import VideoPlayer from "../../Components/VideoPlayer";
import { useLocation } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";

export default function MovieDescription() {
  const { state } = useLocation();
  const trailer = state.trailer;
  const thumbnail = state.thumbnail;
  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-16 px-20 items-center justify-center text-white">
        <VideoPlayer trailer={trailer} thumbnail={thumbnail} />{" "}
      </div>
    </HomeLayout>
  );
}
