import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FaDownload, FaPlus, FaArrowLeft, FaPlay, FaRegStar, FaCheck, FaStar } from "react-icons/fa";
import { addToWatchList, removeFromWatchList } from "../../redux/slices/authSlice";
import axiosInstance from "../../config/axiosInstance";
import HomeLayout from "../../Layouts/HomeLayout";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";

export default function MovieDescription() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);

  // Removed movie slice selector
  const { watchList, isLoggedIn } = useSelector((state) => state.auth);
  const { genres: apiGenres } = useSelector((state) => state.genre) || { genres: [] };

  const [currentMovie, setCurrentMovie] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showRatingUI, setShowRatingUI] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await axiosInstance.get(`/movies/${id}`);
        if (response?.data?.success) {
          setCurrentMovie(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load movie details");
      }
    }
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const movieData = currentMovie?.movie;
  const trailer = movieData?.videoFile || "";
  const trailerSource = trailer ? `${trailer.trim()}?f_auto=mp4` : "";
  const thumbnail = movieData?.thumbnail;
  const title = movieData?.title;
  const description = movieData?.description;
  const year = movieData?.year || "N/A";
  const avgRating = currentMovie?.avgRating;

  // Logic to check if movie is in watchlist
  const isAdded = watchList?.some((movie) => (movie._id === id) || (movie === id));

  const handleWatchList = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add to watchlist");
      navigate("/login");
      return;
    }
    if (isAdded) {
      await dispatch(removeFromWatchList(id));
    } else {
      await dispatch(addToWatchList(id));
    }
  };

  const handleToggleRatingUI = () => {
    if (!isLoggedIn) {
      toast.error("Please login to rate this movie");
      navigate("/login");
      return;
    }
    setShowRatingUI(!showRatingUI);
  }

  const handleSubmitRating = async (ratingValue) => {
    try {
      await axiosInstance.post("/rating/add", { movieId: id, rating: ratingValue });
      toast.success("Rating submitted!");
      setShowRatingUI(false);

      // Manually refresh data if needed or just notify
      // To keep it simple, we might not need to refetch immediately or we can extract fetch logic. 
      // For now, let's just leave it as is or trigger a re-mount if absolutely needed, but usually rating update doesn't need immediate UI refresh of anything other than stars.
      // If we really want to update avgRating, we need to fetch again.
      const response = await axiosInstance.get(`/movies/${id}`);
      if (response?.data?.success) {
        setCurrentMovie(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to submit rating");
    }
  }

  function formatDuration(duration) {
    if (!duration) return "N/A";
    const num = Number(duration);
    if (isNaN(num)) return duration;
    const hrs = Math.floor(num);
    const decimalPart = num.toString().split('.')[1];
    let mins = 0;
    if (decimalPart) {
      mins = parseInt(decimalPart.substring(0, 2));
    }
    return `${hrs}h ${mins}m`;
  }

  const formattedDuration = formatDuration(movieData?.duration);
  const language = movieData?.language ? (Array.isArray(movieData.language) ? movieData.language.join(", ") : movieData.language) : "English";
  const rawGenres = movieData?.genres || movieData?.genre || [];
  const genres = Array.isArray(rawGenres) ? rawGenres : [rawGenres];

  const handleDownload = async () => {
    // ... existing implementation
    if (!movieData) return;
    try {
      const link = document.createElement("a");
      link.href = trailerSource;
      link.download = title || "movie";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Error downloading video");
      console.error("Error downloading video:", error);
    }
  };

  const handleWatchNow = () => {
    setHasStarted(true); // Ensure overlay is gone
    setPlaying(true);    // Start playing

    // Smooth scroll to player
    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Attempt to fullscreen the VIDEO element specifically (to match native behavior)
    setTimeout(() => {
      const internalPlayer = playerRef.current?.getInternalPlayer();
      const videoElement = internalPlayer || playerContainerRef.current?.querySelector('video');

      if (videoElement) {
        if (videoElement.requestFullscreen) videoElement.requestFullscreen();
        else if (videoElement.webkitRequestFullscreen) videoElement.webkitRequestFullscreen();
        else if (videoElement.msRequestFullscreen) videoElement.msRequestFullscreen();
      }
    }, 100); // Small delay to ensure render updates if needed
  };

  const handleOverlayPlay = () => {
    setHasStarted(true);
    setPlaying(true);
  };

  if (!movieData) {
    // ... existing loading
    return (
      <HomeLayout>
        <div className="flex justify-center items-center min-h-screen bg-[#141414] text-white">
          <span className="loading loading-spinner loading-lg text-yellow-500"></span>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="w-full min-h-screen bg-[#141414] relative text-white flex flex-col pt-14 px-1 md:px-6 pb-10">

        <div className="max-w-[1400px] mx-auto w-full">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* LEFT COLUMN: Player + Details */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Video Player */}
              <div
                ref={playerContainerRef}
                className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-zinc-800 relative z-10 group"
              >
                {/* Custom Thumbnail Overlay (mimics light mode) */}
                {!hasStarted && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
                    <img
                      src={thumbnail}
                      alt="Video Thumbnail"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <button
                      onClick={handleOverlayPlay}
                      className="relative z-30 bg-yellow-500 text-black rounded-full p-6 hover:scale-110 transition-transform shadow-lg shadow-yellow-500/20"
                    >
                      <FaPlay size={32} />
                    </button>
                  </div>
                )}

                <ReactPlayer
                  ref={playerRef}
                  url={trailerSource}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={playing}
                  // Removed light prop to keep video element in DOM
                  onPlay={() => {
                    setHasStarted(true);
                    setPlaying(true);
                  }}
                  onPause={() => setPlaying(false)}
                />
              </div>

              {/* Details Below Player */}
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight uppercase">
                  {title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-400">
                  <span className="text-white">{year}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                  <span className="text-white">{formattedDuration}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                  <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-200 border border-zinc-700 text-xs tracking-wider uppercase">
                    {language}
                  </span>

                  {/* Avg Rating - Badge Style */}
                  {avgRating && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                      <span className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-xs font-bold text-red-500">
                        {avgRating % 1 === 0 ? avgRating : avgRating.toFixed(1)}/5 <FaStar className="text-xs" />
                      </span>
                    </>
                  )}

                  {/* Genres */}
                  {genres.length > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((g, idx) => {
                          // Resolve genre name: Handle object, ID string, or Name string
                          let genreName = g;
                          if (typeof g === 'object') {
                            genreName = g?.name || g?.title || "Unknown";
                          } else if (typeof g === 'string') {
                            // Try to find by ID
                            const match = apiGenres?.find(ag => ag._id === g);
                            if (match) genreName = match.name;
                            // Else it might be a name already, leave as is
                          }

                          return (
                            <span key={idx} className="px-3 py-1 text-xs font-bold text-zinc-300 bg-zinc-800/80 rounded-full border border-zinc-700 capitalize">
                              {genreName}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <button
                    onClick={handleWatchNow}
                    className="flex-1 min-w-[160px] bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                  >
                    <FaPlay className="text-sm" /> WATCH NOW
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 min-w-[160px] bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all border border-zinc-700 active:scale-95 group"
                  >
                    <FaDownload className="text-sm group-hover:text-yellow-500 transition-colors" /> Download
                  </button>
                  <button
                    onClick={handleWatchList}
                    className={`${isAdded ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-zinc-800 text-white border-zinc-700'} hover:bg-opacity-80 border p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-lg`}
                    title={isAdded ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    {isAdded ? <FaCheck /> : <FaPlus />}
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Thumbnail (Small) + Description + Rate Button */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Thumbnail with User's requested classes */}
              <div className="w-full flex justify-center lg:block">
                <img
                  src={thumbnail}
                  alt={title}
                  className="mb-5 mt-1 hidden h-64 max-h-full w-full border border-opacity-75 shadow-md ring ring-white ring-opacity-75 lg:block object-cover rounded-md"
                />
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-yellow-500 mb-2 border-l-4 border-yellow-500 pl-3">Synopsis</h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  {description}
                </p>

                {/* Rate Movie Section (Inline) */}
                <div className="mt-6">
                  {!showRatingUI ? (
                    <button
                      onClick={handleToggleRatingUI}
                      className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white py-2 rounded-lg text-sm font-semibold border border-zinc-700/50 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <FaRegStar /> Rate Movie
                    </button>
                  ) : (
                    <div className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-xs text-zinc-400 font-medium">Select your rating</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`cursor-pointer text-xl transition-transform hover:scale-110 active:scale-95 ${userRating >= star ? 'text-yellow-500' : 'text-zinc-600'}`}
                            onClick={() => handleSubmitRating(star)}
                            onMouseEnter={() => setUserRating(star)}
                            title={`Rate ${star}`}
                          />
                        ))}
                      </div>
                      <button onClick={() => setShowRatingUI(false)} className="text-xs text-zinc-500 hover:text-white mt-1 underline">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

