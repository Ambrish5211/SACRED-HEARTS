
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPlus, FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchList, removeFromWatchList } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

function MoviesCard({ data }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { watchList, isLoggedIn } = useSelector((state) => state.auth);

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

  function formatDuration(duration) {
    if (!duration) return "N/A";
    const num = Number(duration);
    if (isNaN(num)) return duration;

    // User requested logic: 2.445 -> 2 hr 44 min
    // Assuming decimal part represents minutes directly if the user's example is to be taken literally
    // Or standard decimal hours. Let's try standard decimal first, but if the user specifically cited 2.445 -> 44, 
    // they might be storing data as H.MM. 
    // If I treat 2.445 as H.MM -> 2h 44m (taking first 2 decimal digits)

    const hrs = Math.floor(num);
    // If we treat .445 as 44.5 minutes? Or 0.445 * 60?
    // "durations if 2.445 then add 2 hr 44 min" -> This strongly suggests treating digits after decimal as minutes.
    const decimalPart = num.toString().split('.')[1];
    let mins = 0;
    if (decimalPart) {
      mins = parseInt(decimalPart.substring(0, 2)); // Take first 2 digits
    }

    return `${hrs} hr ${mins} min`;
  }

  return (
    <div className="group w-[22rem] h-[500px] bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer border-2 border-transparent hover:border-yellow-500 relative">

      {/* Thumbnail Section - Fixed Height */}
      <div className="overflow-hidden relative h-[60%]">
        <img
          onClick={() => navigate(`/movies/description/${data._id}`)}
          src={data?.thumbnail}
          alt={data?.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
            <span>{data?.language ? (Array.isArray(data.language) ? data.language.join(", ") : data.language) : "English"}</span>
          </div>


          {/* Description (Optional, might encroach on space) */}
          {/* <p className="text-xs text-gray-500 line-clamp-2">{data?.description}</p> */}
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
