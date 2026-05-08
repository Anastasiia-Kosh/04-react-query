import { fetchMovies } from "../../services/movieService";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "../../ReactPaginate/ReactPaginate";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  
  const { data, isLoading, isError, isSuccess} = useQuery({
    queryKey: ["movie", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: Boolean(searchQuery),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;
  
  useEffect(() => {
    if (searchQuery && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, searchQuery]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && <MovieGrid movies={data.results} onSelect={handleSelectMovie} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <div>
        <Toaster />
      </div>
    </div>
  );
}
