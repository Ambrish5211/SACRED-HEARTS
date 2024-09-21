import { Movie } from "../models/movie.model";
import { asyncHandler } from "../utils/asyncHandler";


const getMovies = asyncHandler(async (req, res) => {
  const movies = Movie.find
})