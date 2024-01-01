import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// import CourseCard from "../../Components/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllMovies } from "../../redux/slices/movieSlice";
function MoviesList() {
  const dispatch = useDispatch();

  const { movieList } = useSelector((state) => state.movie);

  async function loadMovies() {
    await dispatch(getAllMovies());
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-12 flex flex-col gap-10 text-white">
        <h1 className="text-center text-4xl font-semibold mb-5">
          Explore courses made by{" "}
          <span className="font-bold text-yellow-500">Industry experts</span>
        </h1>
        <div className="mb-10 flex flex-wrap gap-16 justify-between px-12">
          {movieList?.map((element) => {
            return <CourseCard key={element._id} data={element} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
}

export default MoviesList;
