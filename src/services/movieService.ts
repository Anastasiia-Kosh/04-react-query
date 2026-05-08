
import axios from "axios";
import type { Movie } from "../types/movie";


interface MovieService {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (userQuery: string, page:number): Promise<MovieService> => {
     const token = import.meta.env.VITE_TMDB_TOKEN

  const response = await axios.get<MovieService>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: userQuery,
        page
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
