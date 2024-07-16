import { useCallback, useContext, useEffect } from "react";
import { LibraryContext, LibraryElements, LoginContext, LoginUpdateContext, LoginUpdateValues, LoginValues } from './_app';
import Link from "next/link";

function MyLibrary() {
    const libraryContext = useContext<LibraryElements>(LibraryContext);
    const allMovies = useContext<LoginValues>(LoginContext);
    const contextFunctions = useContext<LoginUpdateValues>(LoginUpdateContext)
    let libraryFromLocalStorage: (string | number)[][] = [];
    let boughtsFromLocalStorage: (string | number)[][] = [];
    useEffect(() => {
      libraryFromLocalStorage = JSON.parse(localStorage.getItem("library") as string);
      libraryContext.library = libraryFromLocalStorage;
      boughtsFromLocalStorage = JSON.parse(localStorage.getItem("userStorage") as string).boughtMovies;
      allMovies.movies = boughtsFromLocalStorage;
    },[]) 


    const sendMovies = useCallback(async ( email: string, movies: (string | number)[][]) => {
        try {
          const response = await fetch('/api/addMovies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, movies }),
          });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
        contextFunctions.loadMovies([...allMovies.movies, ...libraryContext.library]);
        localStorage.setItem("userStorage", JSON.stringify({...JSON.parse(localStorage.getItem("userStorage") as string), boughtMovies: allMovies.movies}));
      }, []);
      
    const Boughts = useCallback(() => {
      console.log(allMovies.movies, "movies_list");
        const result = allMovies.movies.map((movie, index) => {
          return (
            <div className="center">
                {movie[1]}
            </div>
        )
        })
        return (
          <>
            {result}
          </>
        )
      },[allMovies.movies]);

      const Added = useCallback(() => {
        console.log("update", libraryContext.library);
        const result = libraryContext.library.map((movie, index) => {
          return (
            <div className="center">
                {movie[1]}
            </div>
        )
        })
        return (
          <>
            {result}
          </>
        )
      },[libraryContext.library]);

      const handleSendButton = useCallback(() => {
        sendMovies(allMovies.email, libraryContext.library);
        libraryContext.library.map((el) => {
          libraryContext.deleteMovieFromLibrary(el[0] as string);
        })
        localStorage.setItem("library", JSON.stringify(libraryContext.library));
      },[]);

      const Summary = useCallback(() => {
        let summary: number = 0;
        libraryContext.library.map((movie, index) => {
            summary = summary + (movie[2] as number);
        })

        return (
          <>
<div className="center">
  {libraryContext.library.length !== 0 ? (
    <>
      You have ordered {libraryContext.library.length} movies. 
      {` It all costs you ${summary}$ `}
      <button onClick={() => handleSendButton()}> Send your order</button>
    </>
  ) : (
    "You have ordered nothing."
  )}
</div>

          </>
        )
      },[libraryContext.library])
    return ( 
        <>
            <div className="top-bar"><p className="text"> Your Library </p><Link href="/movies" className="logout-link">Go back to movies</Link> <Link href="/" onClick={() => {contextFunctions.logout()}} className="logout-link">Logout</Link></div>
            <div className="my-library">
                <div className="my-movie center">
                    <p className="p-over-list">Here's the list of movies. That you have already bought:</p>
                    <div>{Boughts()}</div>
                    
                </div>
                <div className="added center"r>
                    <p className="p-over-list">Here's the list of movies. That you have added to your wish list:</p>
                    <div>{Added()}</div>
                    
                </div>
                <div className="summary center">
                    <p className="p-over-list">Here's the summary of your order:</p>
                    <div>{Summary()}</div>
                    
                    {/* <button onClick={() => sendMovies(LoginContext.)}></button> */}
                </div>
            </div>
        </>
     );
}

export default MyLibrary;