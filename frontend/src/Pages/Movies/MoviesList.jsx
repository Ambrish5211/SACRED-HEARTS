import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import HomeLayout from "../../Layouts/HomeLayout";
import { getAllMovies } from "../../redux/slices/movieSlice";
import MoviesCard from "../../Components/MoviesCard";
function MoviesList() {
  const dispatch = useDispatch();

  const { movieList } = useSelector((state) => state.movie);

  async function loadMovies() {
    await dispatch(getAllMovies());
  }

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <HomeLayout>
      <div className="flex min-h-[90vh] w-full flex-col gap-10 px-10 pr-2 pt-12 text-white lg:px-12">
        <h1 className="mb-5 text-center text-4xl font-semibold">
          Top Rated
          <span className="font-bold text-yellow-500"> Movies</span>
        </h1>
        <div className="mb-10 flex flex-wrap justify-between gap-16 px-6 lg:px-12">
          {movieList?.map((element) => {
            return <MoviesCard key={element.movie_id} data={element} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
}

export default MoviesList;
