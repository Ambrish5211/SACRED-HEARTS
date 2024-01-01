import React from "react";
import ReactPlayer from "react-player";
import HomeLayout from "../Layouts/HomeLayout";

const VideoPlayer = ({ trailer, thumbnail }) => {
  const videoPlayerStyle = {
    border: "1px solid #36454F",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    padding: "16px",
  };
  return (
    <ReactPlayer
      url={trailer}
      controls={true} // Adds play/pause controls
      width="885px"
      height="470px"
      light={thumbnail}
      style={videoPlayerStyle}
    />
  );
};

export default VideoPlayer;
