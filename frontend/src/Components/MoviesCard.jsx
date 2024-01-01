import { useNavigate } from "react-router-dom";

function MoviesCard({ data }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/movies/description", { state: { ...data } })}
      className="text-white w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700 transform transition-transform ease-in-out hover:scale-105 "
    >
      <div className="overflow-hidden">
        <img
          alt="Course thumbnail"
          src={data?.thumbnail}
          className="h-48 w-full rounded-tl-lg rounded-tr-lg group:hover:scale=[1,2] transition-all ease-in-out duration-300"
        />
        <div className="p-3 space-y-3 text-white ">
          <h2 className="text-cl font-bold  text-yellow-500 line-clamp-2 text-center text-xl ">
            {data?.title}
          </h2>
          <p className="line-clamp-2">{data?.description}</p>
          <p className="font-semibold">
            Duration:
            <span className="font-bold text-yellow-500">
              {" "}
              {data?.duration_minutes} min
            </span>
          </p>
          <p className="font-semibold">
            Genre:
            <span className="font-bold text-yellow-500"> {data?.genres}</span>
          </p>
          <p className="font-semibold">
            Release_Date:
            <span className="font-bold text-yellow-500">
              {" "}
              {data?.release_date}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MoviesCard;
