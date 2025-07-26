
import { useNavigate } from "react-router-dom";

function MoviesCard({ data }) {
  const navigate = useNavigate();

  return (
    <div
     
      className="group h-[500px] w-[22rem] transform  overflow-hidden rounded-lg bg-zinc-700 text-white shadow-lg transition-transform ease-in-out hover:scale-105 "
    >
      <div className="overflow-hidden">
        <img
           onClick={() =>
        navigate(`/movies/description/${data.title}`, { state: { ...data } })
      }
          alt="Movie thumbnail"
          src={data?.thumbnail}
          className="group:hover:scale=[1,2] h-64
           w-full rounded-tl-lg rounded-tr-lg transition-all cursor-pointer duration-300 ease-in-out"
        />
        <div className=" p-5 text-slate-300 ">
          <h2 className="line-clamp-2 text-center text-3xl font-bold uppercase text-yellow-500 p-3">
            {data?.title}
          </h2>
          <p className="line-clamp-2 ">{data?.description}</p>

          <button
          onClick={() =>
            navigate(`/movies/description/${data.title}`, { state: { ...data } })
          }
          className="w-full my-9 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          WATCH NOW
        </button>
         
        </div>
      </div>
    </div>
  );
}

export default MoviesCard;




