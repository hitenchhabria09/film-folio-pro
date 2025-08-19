import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MovieGrid } from '@/components/movies/MovieGrid';
import { movieService, Movie } from '@/services/movieService';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';

export const Favorites: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavoriteMovies = async () => {
      if (!user || user.favorites.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Load movies from favorites by fetching each one individually
        const moviePromises = user.favorites.map(id => movieService.getMovieById(id));
        const movies = await Promise.all(moviePromises);
        const validMovies = movies.filter(movie => movie !== null) as Movie[];
        setFavoriteMovies(validMovies);
      } catch (error) {
        console.error('Failed to load favorite movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteMovies();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cinema-red to-cinema-gold rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cinema-gold to-accent bg-clip-text text-transparent">
                My Favorites
              </h1>
              <p className="text-muted-foreground">
                {user?.favorites.length || 0} movie{(user?.favorites.length || 0) !== 1 ? 's' : ''} in your collection
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <MovieGrid movies={[]} loading={true} />
        ) : favoriteMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-cinema-red/20 to-cinema-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start exploring movies and add them to your favorites to see them here. 
              Click the heart icon on any movie card to add it to your collection.
            </p>
          </div>
        ) : (
          <MovieGrid movies={favoriteMovies} />
        )}
      </main>
    </div>
  );
};