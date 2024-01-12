import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ trailer, thumbnail }) => {
  const videoPlayerStyle = {
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    padding: "",
    background: "#000",
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
