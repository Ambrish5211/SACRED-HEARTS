import React from "react";
import ReactPlayer from "react-player";
import HomeLayout from "../Layouts/HomeLayout";

const VideoPlayer = ({ trailer, thumbnail }) => {
  const videoPlayerStyle = {
    border: "1px solid #36454F",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    padding: "16px",
    background: "#000",
    width: "100%",
  };
  return (
    <ReactPlayer
      url={trailer}
      controls={true}
      light={thumbnail}
      style={videoPlayerStyle}
      width="100%"
      height="80%"
      config={{
        youtube: {
          playerVars: {
            modestbranding: 1,
            showinfo: 0,
            controls: 1,
          },
        },
      }}
    />
  );
};

export default VideoPlayer;
