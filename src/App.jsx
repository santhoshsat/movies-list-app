import React, { useState, useEffect } from 'react';
import {useDebounce} from 'react-use';
import Search from './components/Search.jsx';
import hero from './assets/hero.png';
import background from './assets/hero-bg.png';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';




const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm,setDebounceSearchTerm] =useState('')

  useDebounce(()=>setDebounceSearchTerm(searchTerm),500,[searchTerm])

  const fetchMovies = async (query ='') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        :  `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const res = await fetch(endpoint, API_OPTIONS);
      if (!res.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await res.json();
      setMoviesList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [debounceSearchTerm]);

  return (
    <main
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src={hero} alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> you'll enjoy without the hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className='mt-[40px]'>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
               <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div> 
    </main>
  );
};

export default App;
