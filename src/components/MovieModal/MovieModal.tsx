import { createPortal } from 'react-dom';
import css from './MovieModal.module.css'
import { useEffect } from 'react';
import type { Movie } from '../../types/movie';

interface MovieModalProps{
    movie: Movie;
    onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
    };
    useEffect(() => {
        document.body.style.overflow = "hidden";
        
	  const handleKeyDown = (e: KeyboardEvent) => {
	    if (e.key === "Escape") {
	      onClose();
	    }
	  };
	
	  document.addEventListener("keydown", handleKeyDown);
	
        return () => {
          document.body.style.overflow = "auto";
	    document.removeEventListener("keydown", handleKeyDown);
	  };
	}, [onClose]);

    return createPortal(
        <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
  <div className={css.modal}>
    <button className={css.closeButton} onClick={onClose} aria-label="Close modal">
      &times;
    </button>
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
      alt={movie.title}
      className={css.image}
    />
    <div className={css.content}>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>
        <strong>Release Date:</strong>{movie.release_date}
      </p>
      <p>
        <strong>Rating:</strong> {movie.vote_average}/10
      </p>
    </div>
  </div>
</div>,
    document.body
    ) 
}
