import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const movieList = [
	{ title: 'Pee Mak', director: 'Banjong Pisanthanakun', year: 2013, genre: 'Comedy, Horror' },
	{ title: 'Bad Genius', director: 'Nattawut Poonpiriya', year: 2017, genre: 'Thriller' },
	{ title: 'Ong-Bak: Muay Thai Warrior', director: 'Prachya Pinkaew', year: 2003, genre: 'Action' },
	{ title: 'The Love of Siam', director: 'Chookiat Sakveerakul', year: 2007, genre: 'Romance, Drama' }
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App movies={movieList} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
