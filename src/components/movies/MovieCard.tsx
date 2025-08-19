import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock } from 'lucide-react';
import { Movie } from '@/services/movieService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isInFavorites, addToFavorites, removeFromFavorites } = useAuth();
  const navigate = useNavigate();
  const isFavorite = isInFavorites(movie.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer bg-gradient-to-br from-cinema-surface to-card border-cinema-gold/20 hover:border-cinema-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cinema-gold/20"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Favorite button */}
          <Button
            size="sm"
            variant="ghost"
            className={`absolute top-3 right-3 h-10 w-10 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-cinema-red/80 hover:bg-cinema-red text-white' 
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            onClick={handleFavoriteToggle}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Rating badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 text-cinema-gold fill-current" />
            <span className="text-xs text-white font-medium">{movie.rating}</span>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-cinema-gold transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{movie.duration} min</span>
            <span>•</span>
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-cinema-gold/20 text-cinema-gold text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {movie.overview}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};