
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPlus, FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchList, removeFromWatchList } from "../redux/slices/authSlice";
import toast from "react-hot-toast"; // Ensure this is imported
import axiosInstance from "../config/axiosInstance"; // Ensure this is imported

function MoviesCard({ data, onDelete }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { watchList, isLoggedIn, isAdmin } = useSelector((state) => state.auth);
  const { genres: apiGenres } = useSelector((state) => state.genre) || { genres: [] };

  const isAdded = watchList?.some((movie) => (movie._id === data?._id) || (movie === data?._id));

  const handleWatchList = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to add to watchlist");
      return;
    }
    if (isAdded) {
      await dispatch(removeFromWatchList(data?._id));
    } else {
      await dispatch(addToWatchList(data?._id));
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      const response = await axiosInstance.delete(`/movies/delete-movie/${data._id}`);
      if (response?.data?.success) {
        toast.success("Movie deleted successfully");
        // Refresh logic
        if (window.location.pathname === "/movies") {
          window.location.reload();
        } else {
          navigate("/movies");
        }
        // If parent provided onDelete callback
        if (onDelete) onDelete(data._id);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete movie");
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
      mins = parseInt(decimalPart.substring(0, 2)); // Take first 2 digits
    }

    return `${hrs} hr ${mins} min`;
  }

  return (
    <div className="group w-[18rem] sm:w-[22rem] h-[500px] bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border-2 border-transparent hover:border-yellow-500 relative">

      {/* Thumbnail Section - Fixed Height */}
      <div className="overflow-hidden relative h-[60%]">
        <img
          onClick={() => navigate(`/movies/description/${data._id}`)}
          src={data?.thumbnail}
          alt={data?.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Admin Controls Overlay */}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/editmovie/${data._id}`);
              }}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-colors"
              title="Edit Movie"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-colors"
              title="Delete Movie"
            >
              <FaTrash size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-between h-[40%] text-slate-300 bg-zinc-800 relative z-10">
        <div>
          {/* Title */}
          <h2 className="text-xl font-bold text-yellow-500 uppercase leading-tight line-clamp-2 mb-2">
            {data?.title}
          </h2>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
            <span>{data?.year || "N/A"}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{formatDuration(data?.duration)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span className="capitalize">{data?.languages ? (Array.isArray(data.languages) ? data.languages.join(", ") : data.languages) : (data?.language ? (Array.isArray(data.language) ? data.language.join(", ") : data.language) : "English")}</span>
          </div>

          {/* Genre Display */}
          <div className="flex flex-wrap gap-1 mb-2">
            {(() => {
              const rawGenres = data?.genres || data?.genre || [];
              const genreList = Array.isArray(rawGenres) ? rawGenres : [rawGenres];

              return genreList.slice(0, 3).map((g, idx) => {
                let genreName = g;
                // If object, use name. If ID string, lookup in apiGenres
                if (typeof g === 'object') {
                  genreName = g?.name || g?.title;
                } else if (typeof g === 'string') {
                  const match = apiGenres?.find(ag => ag._id === g);
                  if (match) genreName = match.name;
                }

                if (!genreName) return null;

                return (
                  <span key={idx} className="text-[10px] uppercase font-bold text-zinc-200 border border-zinc-400 px-1 rounded">
                    {genreName}
                  </span>
                );
              });
            })()}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/description/${data._id}`);
            }}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
          >
            <FaPlay size={12} /> WATCH NOW
          </button>
          <button
            onClick={handleWatchList}
            className={`${isAdded ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-zinc-700 text-white border-zinc-600'} hover:bg-opacity-80 p-2.5 rounded-md transition-colors shadow-md border hover:border-yellow-500/50 group/btn`}
            title={isAdded ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {isAdded ? (
              <FaCheck size={14} />
            ) : (
              <FaPlus size={14} className="group-hover/btn:text-yellow-500 transition-colors" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoviesCard;
