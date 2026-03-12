import logo from './logo.svg';
import './App.css';

function App(props) {
  // รับ props.movies มาจาก index.js
  const movies = props.movies;

  return (
    <div>
      <h1>List of Thai Movies</h1>

      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <strong>Title:</strong> {movie.title} <br/>
            <strong>Director:</strong> {movie.director} <br/>
            <strong>Release Year:</strong> {movie.year} <br/>
            <strong>Genre:</strong> {movie.genre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;