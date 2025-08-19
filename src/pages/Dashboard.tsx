import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { MovieGrid } from '@/components/movies/MovieGrid';
import { movieService, Movie, MovieResponse } from '@/services/movieService';
import { Film, TrendingUp, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';

export const Dashboard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'popular' | 'trending' | 'top-rated'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const loadMovies = useCallback(async (page: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setMovies([]);
    }

    try {
      let response: MovieResponse;
      
      if (searchQuery.trim()) {
        response = await movieService.searchMovies(searchQuery, page);
      } else {
        switch (activeTab) {
          case 'top-rated':
            response = await movieService.getTopRatedMovies(page);
            break;
          case 'popular':
          default:
            response = await movieService.getPopularMovies(page);
            break;
        }
      }

      if (isLoadMore) {
        setMovies(prev => [...prev, ...response.results]);
      } else {
        setMovies(response.results);
      }
      
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
      setHasNextPage(response.page < response.total_pages);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    loadMovies(1, false);
  }, [loadMovies]);

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasNextPage && !loading && !loadingMore) {
      loadMovies(currentPage + 1, true);
    }
  }, [inView, hasNextPage, loading, loadingMore, currentPage, loadMovies]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // loadMovies will be called automatically by the useEffect
  };

  const handleTabChange = (tab: 'popular' | 'trending' | 'top-rated') => {
    setActiveTab(tab);
    setSearchQuery('');
    setCurrentPage(1);
    // loadMovies will be called automatically by the useEffect
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchValue={searchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 py-16 bg-gradient-to-r from-cinema-red/10 via-cinema-gold/10 to-accent/10 rounded-3xl border border-border/50">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cinema-red to-cinema-gold rounded-full flex items-center justify-center shadow-lg">
              <Film className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cinema-gold via-accent to-cinema-red bg-clip-text text-transparent">
            CinemaScape Explorer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover, explore, and curate your perfect movie collection. 
            From blockbusters to hidden gems, your cinematic journey starts here.
          </p>
        </div>

        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <Badge variant="secondary" className="text-sm">
              {movies.length} movies found
            </Badge>
          </div>
        )}

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Button
              variant={activeTab === 'popular' ? 'default' : 'outline'}
              onClick={() => handleTabChange('popular')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Popular Movies
            </Button>
            <Button
              variant={activeTab === 'trending' ? 'default' : 'outline'}
              onClick={() => handleTabChange('trending')}
              className="flex items-center gap-2"
            >
              <Film className="w-4 h-4" />
              Trending
            </Button>
            <Button
              variant={activeTab === 'top-rated' ? 'default' : 'outline'}
              onClick={() => handleTabChange('top-rated')}
              className="flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Top Rated
            </Button>
          </div>
        )}

        {/* Movies Grid */}
        <MovieGrid movies={movies} loading={loading} />

        {/* Load More Trigger */}
        {hasNextPage && !loading && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading more movies...
              </div>
            )}
          </div>
        )}

        {/* End of Results */}
        {!loading && !hasNextPage && movies.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You've reached the end of the results</p>
          </div>
        )}
      </main>
    </div>
  );
};