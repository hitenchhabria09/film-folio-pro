import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { movieService, Movie } from '@/services/movieService';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Heart, Star, Clock, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { isInFavorites, addToFavorites, removeFromFavorites } = useAuth();

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const movieData = await movieService.getMovieById(id);
        setMovie(movieData);
      } catch (error) {
        console.error('Failed to load movie:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    const isFavorite = isInFavorites(movie.id);
    if (isFavorite) {
      removeFromFavorites(movie.id);
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites.`,
      });
    } else {
      addToFavorites(movie.id);
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="h-96 bg-muted rounded-lg" />
              <div className="md:col-span-2 space-y-4">
                <div className="h-12 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = isInFavorites(movie.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>
        
        <div className="container mx-auto px-4 relative -mt-48">
          <Button 
            variant="ghost" 
            className="mb-6 text-cinema-gold hover:text-accent"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="space-y-4">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg shadow-cinema-gold/20"
              />
              
              <Button
                onClick={handleFavoriteToggle}
                className={`w-full ${
                  isFavorite
                    ? 'bg-cinema-red hover:bg-cinema-red/80 text-white'
                    : 'bg-gradient-to-r from-cinema-gold to-accent hover:from-accent hover:to-cinema-gold text-cinema-dark'
                }`}
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
            
            {/* Movie Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cinema-gold to-accent bg-clip-text text-transparent">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-cinema-gold fill-current" />
                    <span className="font-medium">{movie.rating}/10</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration} minutes</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                </div>
              </div>
              
              {/* Genres */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="secondary"
                      className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/40"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Overview */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              </div>
              
              {/* Release Date */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Release Date</h3>
                <p className="text-muted-foreground">
                  {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};