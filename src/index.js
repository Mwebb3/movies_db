import React, {useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import AddMovie from './AddMovie';


const App = ()=> {
const [movies, setMovies] = useState([]);
const [error, setError] = useState("");

useEffect(() => {
  const fetchMovies = async() => {
    const response = await axios.get("/api/movies");
    setMovies(response.data)
  }
  fetchMovies()
}, []);

const increaseRating = async(movie) => {
  try{
    setError("")
    const newRating = movie.stars + 1;
    const {data} = await axios.put(`/api/movies/${movie.id}`, {title: movie.title, stars: newRating});
    
    const newMovies = movies.map((movieMap) => {
      if(movieMap.id === movie.id){
        return data
      } else{
        return movieMap
      }
    });
    setMovies(newMovies);
  } catch (error) {
    setError(error.response.data)
  }
};

const decreaseRating = async(movie) => {
  try {
    setError("");
    const newRating = movie.stars - 1;
    const {data} = await axios.put(`/api/movies/${movie.id}`, {title: movie.title, stars: newRating});
    
    const newMovies = movies.map((movieMap) => {
      if(movieMap.id === movie.id){
        return data
      } else{
        return movieMap
      }
    })
    setMovies(newMovies);
  } catch (error) {
    setError(error.response.data);
  }
};

const deleteMovie = async (movie) => {
  const data = await axios.delete(`/api/movies/${movie.id}`);
  const updatedList = movies.filter((movieFilt) => {
    return movieFilt.id !== movie.id
  });
  setMovies(updatedList)
};

  return (
    <div>
      <h1>Movies ({movies.length})</h1>
      <p>{error? error: ""}</p>
      <AddMovie movies={movies} setMovies={setMovies}/>
      <ul>
        {
          movies.map((movie) => {
            return (
              <li key={movie.id}>
                <h2>{movie.title}</h2>
                <span>
                  <h3>
                    Rating: {movie.stars} Stars
                    <button onClick={() => {decreaseRating(movie)}}>
                      -
                    </button>
                    <button onClick={() => {increaseRating(movie)}}>
                      +
                    </button>
                  </h3>
                  <button onClick={() => {deleteMovie(movie)}}>Delete</button>
                </span>
              </li>
            )
          })
        }
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
