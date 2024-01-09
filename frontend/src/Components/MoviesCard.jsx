import { useNavigate } from "react-router-dom";

function MoviesCard({ data }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/movies/description/${data.title}`, { state: { ...data } })
      }
      className="group h-[430px] w-[22rem] transform cursor-pointer overflow-hidden rounded-lg bg-zinc-700 text-white shadow-lg transition-transform ease-in-out hover:scale-105 "
    >
      <div className="overflow-hidden">
        <img
          alt="Course thumbnail"
          src={data?.thumbnail}
          className="group:hover:scale=[1,2] h-48 w-full rounded-tl-lg rounded-tr-lg transition-all duration-300 ease-in-out"
        />
        <div className="space-y-3 p-3 text-white ">
          <h2 className="text-cl line-clamp-2  text-center text-xl font-bold text-yellow-500 ">
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
