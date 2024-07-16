"use client"

import React, { useCallback, useContext, useMemo } from 'react'
import { useEffect, useState } from 'react';
import { LibraryContext, LibraryElements, LoginContext, LoginUpdateContext, LoginUpdateValues, LoginValues } from './_app';
import Link from 'next/link';
import styled from 'styled-components';

const Paragraph = styled.p<{ $bought?: boolean, $added?: boolean, $available?: number }>`
  font-size: medium;
  position: relative;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  &::before {
    content: "${props => {
      if (props.$bought) {
        return 'Bought';
      }
      if (props.$added) {
        return 'Added';
      }
      return props.$available !== undefined ? `${props.$available}$` : '';
    }}";
    color: white;
    font-size: 30px;
  }
`;

function Movies() {
    const [movies, setMovies] = useState<any>([]);
    const contextValues = useContext<LoginValues>(LoginContext);
    const contextFunctions = useContext<LoginUpdateValues>(LoginUpdateContext);
    const contextLib = useContext<LibraryElements>(LibraryContext);
  
    useEffect(() => {
     const localStorageObject = JSON.parse(localStorage.getItem('userStorage') as string);
        if(localStorageObject.logged) contextValues.logged = true;
        contextValues.movies = localStorageObject.boughtMovies;
        const fetchMovies = async () => {
            try {
                const response = await fetch('/api/movies');
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data = await response.json();
                setMovies(data); // Assuming movies are returned under 'movies' key
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
        
        fetchMovies();
        while(movies.length != 0) fetchMovies(); 
    }, []);
    const handleError = useCallback((event: any) => {
      event.target.src = "https://picsum.photos/200/300";
    },[]);

    const handleLibraryState = useCallback((stopFunction: boolean, inLibrary: boolean, id: string, title: string) => {
      const price: number = parseFloat(((title.length)*2.4).toFixed(2));
      if(stopFunction) return;
      if(inLibrary){
        contextLib.deleteMovieFromLibrary(id);
      }else{
        contextLib.addMovieToLibrary(id, title, price);
      }
      
    },[])

    const isInLibrary = (movieId: string) => {
      return contextLib.library.some(([id, title, price]) => id === movieId);
    };

    const isBought = (movieId: string) => {
      return contextValues.movies.some((el) => el[0] === movieId);
    };

    const Component = useCallback(() => {
      console.log("movies", movies);
      const result = movies.map((movie, index) => {
        return (
          <div className="gallery" key={`div-${index}`}>
            <Paragraph key={`paragraph-${index}`} onClick={() => handleLibraryState(isBought(movie._id), isInLibrary(movie._id), movie._id, movie.title)} $bought={isBought(movie._id)} $added={isInLibrary(movie._id)} $available={parseFloat(((movie.title.length)*2.4).toFixed(2))} ></Paragraph> 
            <img onClick={() => handleLibraryState( isBought(movie._id), isInLibrary(movie._id), movie._id, movie.title ) } src={`https://picsum.photos/id/${index+12}/200/300`} key={`index-${index}`} alt="No photo for this movie"  onError={(e) => handleError(e)}/>
            <li onClick={() => handleLibraryState( isBought(movie._id), isInLibrary(movie._id), movie._id, movie.title ) } key={`li-${index}`}>{movie.title}</li>
          </div>
         
      )
      })
      return (
        <>
          {result}
        </>
      )
    },[contextLib.library, contextValues.logged, movies])

    const goToLibraryAction = () => {
      localStorage.setItem("library", JSON.stringify(contextLib.library));
    };
  return (
    <>
    <div className="top-bar">
       <p className='title'>Movies Page</p>
       <p className="info">{contextValues.logged ? `Hi ${contextValues.username}` : "Click below!"}</p>
       <Link className="logout-link" onClick={() => goToLibraryAction()} href="/myLibrary"> Go to your library </Link>
       <Link href="/" onClick={() => {contextFunctions.logout()}} className="logout-link">Logout</Link>
    </div>
    {contextValues.logged ? <ul className='wrapper-gallery'>
                    {Component()}
                </ul> : <Link href="/" className='banner'>
                        You're already logged out!
                </Link>}
    </>
  )
}

export default Movies;