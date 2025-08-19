import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MovieGrid } from '@/components/movies/MovieGrid';
import { movieService, Movie } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const movies = await movieService.getAllMovies();
        setAllMovies(movies);
        setFilteredMovies(movies);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredMovies(allMovies);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await movieService.searchMovies(query);
      setFilteredMovies(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPopularMovies = () => allMovies.filter(movie => movie.rating >= 8.0);
  const getRecentMovies = () => allMovies.filter(movie => 
    new Date(movie.releaseDate).getFullYear() >= 2023
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchValue={searchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cinema-gold via-accent to-cinema-gold bg-clip-text text-transparent">
              Discover Movies
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore, rate, and save your favorite films in your personal cinema collection
          </p>
        </div>

        {/* Content */}
        {searchQuery ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">Search Results</h2>
              <span className="text-muted-foreground">for "{searchQuery}"</span>
            </div>
            <MovieGrid movies={filteredMovies} loading={loading} />
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-cinema-surface border border-cinema-gold/20">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                All Movies
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">All Movies</h2>
                <MovieGrid movies={allMovies} loading={loading} />
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Popular Movies</h2>
                <MovieGrid movies={getPopularMovies()} loading={loading} />
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Recent Releases</h2>
                <MovieGrid movies={getRecentMovies()} loading={loading} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};