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
      <div className="flex min-h-screen w-full flex-col gap-10 px-10  pt-[4rem] text-white ">
        <h1 className="mb-5 text-center text-4xl font-semibold">
          Top Rated
          <span className="font-bold text-yellow-500"> Movies</span>
        </h1>
        <div className="mb-10 flex flex-wrap justify-center gap-8 px-6 sm:px-12">
          {movieList?.map((element) => {
            return <MoviesCard key={element._id} data={element} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
}

export default MoviesList;
