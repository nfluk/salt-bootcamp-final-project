import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useRef, useState } from "react";
import ButtonSection from "../components/ButtonSection";
import star from '../assets/star.png';

const Home = ({ dislikedMovies,  setDislikedMovies, likedMovies,  setLikedMovies }) => {
  const { user} = useAuth0();
  const [ category, setCategory ] = useState(null);
  const [ counter, setCounter ] = useState(0);
  const [ movies, setMovies ] = useState([]);
  const [ movie, setMovie ] = useState(movies[counter]);
  const [ page, setPage ] = useState(1);
  const info = useRef(null);
  const infoContent = useRef(null);
  const image = useRef(null);


  useEffect(()=>{
    if (!localStorage.getItem("user")) {
      
      fetch('/register', {  
        method: 'POST', 
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: user.email
        }) 
      })
      .then((res)=>res.json())
      .then(data=>{
        console.log(user.email);

      })
      .catch(error=>console.log(error))

      localStorage.setItem("user",JSON.stringify(user.email))
    }
  },[])
  
  useEffect(() => {
     // Defaults to popular movies
     fetch(`https://api.themoviedb.org/3/discover/movie?api_key=2b61576c6129138ce5beeb3937518565&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`)
      .then(res => res.json())
      .then(data => {
        let nope = data.results.map(el => {
          if(!dislikedMovies.find(movie => movie.id === el.id)){
            if(!likedMovies.find(movie => movie.id === el.id)){
              return el;
          }}
          
        });
        setMovies(nope.filter(el => el !== undefined));});
  }, [likedMovies]);


  useEffect(() => {
    if(counter === movies.length - 1){
      setCounter(0);
      const newPage = page+1;
      setPage(newPage);
    }
    setMovie(movies[counter]);
  }, [movies, counter])

  useEffect(() => {
    if(category === null) {
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=2b61576c6129138ce5beeb3937518565&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`)
      .then(res => res.json())
      .then(data => {
        let nope = data.results.map(el => {
          if(!dislikedMovies.find(movie => movie.id === el.id)){
            if(!likedMovies.find(movie => movie.id === el.id)){
              return el;
          }}
          
        });
        setMovies(nope.filter(el => el !== undefined));});
        return;
    }

    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${category}&api_key=2b61576c6129138ce5beeb3937518565&language=en-US`)
      .then(res => res.json())
      .then(data => {
        let nope = data.results.map(el => {
          if(!dislikedMovies.find(movie => movie.id === el.id)){
            if(!likedMovies.find(movie => movie.id === el.id)){
              return el;
          }}
          
        });
        setMovies(nope.filter(el => el !== undefined));
      });
  }, [category, page]);

  // Changing category of films when changing option in dropdown
  const handleChange = (e) => {
    if(e.target.value === "popular"){
      return setCategory(null);
    }
    setCategory(e.target.value);
    setCounter(0);
  }

  const Filter = () => {
    return (
      <div className="option">
        <select className="category_bar" name="category" id="category" onChange={(e) => handleChange(e)}>
          <option class="option_item" value="" disabled selected>Category</option>
          <option class="option_item" selected={category==="popular"} value="popular">Popular</option>
          <option class="option_item"  selected={category==="28"} value="28">Action</option>
          <option class="option_item" selected={category==="18"}  value="18">Drama</option>
          <option class="option_item"  selected={category==="12"} value="12">Adventure</option>
          <option class="option_item" selected={category==="16"} value="16">Animation</option>
          <option class="option_item" selected={category==="35"} value="35">Comedy</option>
          <option class="option_item" selected={category==="80"} value="80">Crime</option>
          <option class="option_item" selected={category==="99"} value="99">Documentry</option>
          <option class="option_item" selected={category==="10751"} value="10751">Family</option>
          <option class="option_item" selected={category==="14"} value="14">Fantasy</option>
          <option class="option_item" selected={category==="36"} value="36">History</option>
          <option class="option_item" selected={category==="27"} value="27">Horror</option>
          <option class="option_item" selected={category==="10402"}  value="10402">Music</option>
          <option class="option_item" selected={category==="9648"} value="9648">Mystery</option>
          <option class="option_item" selected={category==="10749"} value="10749">Romance</option>
          <option class="option_item" selected={category==="878"} value="878">Sience-Fiction</option>
          <option class="option_item" selected={category==="10770"} value="10770">Tv-Movie</option>
          <option class="option_item" selected={category==="53"} value="53">Triller</option>
          <option class="option_item" selected={category==="10752"} value="10752">War</option>
          <option class="option_item" selected={category==="37"} value="37">Western</option>
        </select >
      </div>
    )
  }

  const Movie = () => {
    const visibilityChange = (e) => {
      if(e.target === image.current){
        infoContent.current.className = infoContent.current.className === 'none' ? '' : 'none';
        info.current.className = info.current.className === "movie__description hidden" ?  "movie__description visible" :  "movie__description hidden";
      }
    }

    // const imgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

    return (
      <div className="movie-card">
        <div className="movie-card_main">
          <div className="card-img" ref={image} onClick={(e) => visibilityChange(e)} 
            style={{backgroundImage: 'linear-gradient(to bottom, rgb(245 246 252 / 0%), rgb(0 0 0 / 82%)), url('+ `https://image.tmdb.org/t/p/w500/${movie.poster_path}`+')'}}>
            <div className="button-container">
            </div>
          </div>
              <ButtonSection 
                counter={counter} 
                setCounter={setCounter} 
                dislikedMovies={dislikedMovies} 
                setDislikedMovies={setDislikedMovies} 
                likedMovies={likedMovies} 
                setLikedMovies={setLikedMovies} 
                movie={movie} />
          {/* <img ref={image} src={"https://image.tmdb.org/t/p/w500/"+movie.poster_path} alt={movie.title} onClick={() => visibilityChange()} className="card-img" /> */}
        </div>
        <div ref={info} className="movie__description hidden">
          <div ref={infoContent} class='none'>
            <h2 className="movie-title">{movie.title}</h2>
            <span className="movie-releasedate">Release Date: {movie.release_date}</span>
            <p>{movie.overview}</p>
            <p className="movie-rating">{movie.vote_average}/10<img class="star-icon" src={star}/></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <h1>Home</h1> */}
      <Filter />
      {movie && <Movie key={movie.id} />}
    </div>
  );
};

export default Home;

