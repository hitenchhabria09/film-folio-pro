// Mock movie data service - In a real app, this would fetch from TMDB or similar API
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
}

// Mock movie data
const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1920/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    releaseDate: "2024-02-29",
    rating: 8.5,
    genres: ["Science Fiction", "Adventure", "Drama"],
    duration: 166
  },
  {
    id: "2",
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1920/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    releaseDate: "2023-07-21",
    rating: 8.3,
    genres: ["Drama", "History", "Thriller"],
    duration: 180
  },
  {
    id: "3",
    title: "Spider-Man: Across the Spider-Verse",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1920/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg",
    overview: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.",
    releaseDate: "2023-06-02",
    rating: 8.7,
    genres: ["Animation", "Action", "Adventure"],
    duration: 140
  },
  {
    id: "4",
    title: "The Batman",
    poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1920/qqHQsStV6exghCM7zbObuYBiYxw.jpg",
    overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    releaseDate: "2022-03-04",
    rating: 7.8,
    genres: ["Action", "Crime", "Drama"],
    duration: 176
  },
  {
    id: "5",
    title: "Top Gun: Maverick",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1920/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    overview: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission.",
    releaseDate: "2022-05-27",
    rating: 8.2,
    genres: ["Action", "Drama"],
    duration: 130
  },
  {
    id: "6",
    title: "Avatar: The Way of Water",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1920/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, and the lengths they go to keep each other safe.",
    releaseDate: "2022-12-16",
    rating: 7.6,
    genres: ["Science Fiction", "Adventure", "Action"],
    duration: 192
  }
];

export const movieService = {
  getAllMovies: (): Promise<Movie[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMovies), 500);
    });
  },

  getMovieById: (id: string): Promise<Movie | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const movie = mockMovies.find(m => m.id === id);
        resolve(movie || null);
      }, 300);
    });
  },

  searchMovies: (query: string): Promise<Movie[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredMovies = mockMovies.filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filteredMovies);
      }, 400);
    });
  }
};