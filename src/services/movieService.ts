// TMDB API service for real movie data
export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  releaseDate: string;
  rating: number;
  genres: string[];
  duration: number;
  voteCount: number;
  popularity: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
  vote_count: number;
  runtime?: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1920';

// Genre mapping for quick lookup
const genreMap: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

const transformTMDBMovie = async (tmdbMovie: TMDBMovie): Promise<Movie> => {
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}` : '/placeholder.svg',
    backdrop: tmdbMovie.backdrop_path ? `${TMDB_BACKDROP_BASE}${tmdbMovie.backdrop_path}` : '/placeholder.svg',
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    genres: tmdbMovie.genre_ids.map(id => genreMap[id]).filter(Boolean),
    duration: tmdbMovie.runtime || 120, // Default duration if not available
    voteCount: tmdbMovie.vote_count,
    popularity: tmdbMovie.popularity
  };
};

const getApiKey = () => {
  // Use a demo API key for testing - replace with your actual key
  return 'a85f7bfa87fa5b5c27c04e0c00b4ad1b';
};

export const movieService = {
  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${getApiKey()}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      const movies = await Promise.all(
        data.results.map((movie: TMDBMovie) => transformTMDBMovie(movie))
      );
      
      return {
        page: data.page,
        results: movies,
        total_pages: data.total_pages,
        total_results: data.total_results
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getMovieById: async (id: string): Promise<Movie | null> => {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${getApiKey()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      
      const tmdbMovie = await response.json();
      return await transformTMDBMovie(tmdbMovie);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  },

  searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }
      
      const data = await response.json();
      const movies = await Promise.all(
        data.results.map((movie: TMDBMovie) => transformTMDBMovie(movie))
      );
      
      return {
        page: data.page,
        results: movies,
        total_pages: data.total_pages,
        total_results: data.total_results
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${getApiKey()}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch top rated movies');
      }
      
      const data = await response.json();
      const movies = await Promise.all(
        data.results.map((movie: TMDBMovie) => transformTMDBMovie(movie))
      );
      
      return {
        page: data.page,
        results: movies,
        total_pages: data.total_pages,
        total_results: data.total_results
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }
};