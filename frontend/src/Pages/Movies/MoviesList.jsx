import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import HomeLayout from "../../Layouts/HomeLayout";
import MoviesCard from "../../Components/MoviesCard";
import axiosInstance from "../../config/axiosInstance";

function MoviesList() {
  const [searchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchQuery = searchParams.get("search") || "";
  const filterGenre = searchParams.get("genre") || "";
  const filterYear = searchParams.get("year") || "";
  const filterLanguage = searchParams.get("language") || "";

  async function fetchMovies() {
    try {
      setLoading(true);


      // Determine endpoint: ONLY use movie-list if ABSOLUTELY NO parameters
      const hasFilters = searchQuery || filterGenre || filterYear || filterLanguage;
      const endpoint = hasFilters ? "/movies/search" : "/movies/movie-list";

      const params = {};

      // Add existing parameters
      if (searchQuery) params.query = searchQuery;
      if (filterGenre) params.genre = filterGenre;
      if (filterYear) params.year = filterYear;
      if (filterLanguage) params.language = filterLanguage;

      const response = await axiosInstance.get(endpoint, { params });

      if (response?.data?.data?.moviesList || response?.data?.data) {
        // Fallback if search api returns simple array or different structure
        setMovies(response.data.data.moviesList || response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load movies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [searchQuery, filterGenre, filterYear, filterLanguage]);

  return (
    <HomeLayout>
      <div className="flex min-h-screen w-full flex-col gap-10 px-10 pt-[4rem] text-white">
        <h1 className="mb-5 text-center text-4xl font-semibold">
          {searchQuery ? `Results for "${searchQuery}"` : "Top Rated"}
          <span className="font-bold text-yellow-500"> {searchQuery ? "" : "Movies"}</span>
        </h1>

        <div className="mb-10 flex flex-wrap justify-center gap-8 px-6 sm:px-12">
          {loading ? (
            <div className="flex justify-center items-center w-full h-64">
              <span className="loading loading-spinner loading-lg text-yellow-500"></span>
            </div>
          ) : (
            movies?.length > 0 ? (
              movies.map((element) => {
                return <MoviesCard key={element._id} data={element} />;
              })
            ) : (
              <div className="text-xl text-gray-400 font-semibold mt-10">
                No movies found matching your criteria.
              </div>
            )
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default MoviesList;
