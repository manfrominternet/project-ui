import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useReducer, useState } from "react";

export interface LoginValues {
  logged: boolean;
  username: string;
  movies: (string | number)[][];
  email: string;
}

export interface LoginUpdateValues {
  login: (email: string) => void;
  logout: () => void;
  setName: (name: string) => void;
  loadMovies: (movies: (string | number)[][]) => void;
}

export interface LibraryElements {
  library: (string | number)[][];
  addMovieToLibrary: (id: string, title: string, price: number) => void;
  deleteMovieFromLibrary: (id: string) => void;
}

const initialState: LoginValues = {
  email: "",
  logged: false,
  username: "",
  movies: [],
};

export const LoginContext = createContext<LoginValues>(initialState);
export const LoginUpdateContext = createContext<LoginUpdateValues>({
  login: (email: string) => {},
  logout: () => {},
  setName: (name: string) => {},
  loadMovies: (movies: (string | number)[][]) => {},
});

export const LibraryContext = createContext<LibraryElements>({
  library: [],
  addMovieToLibrary: (id: string, title: string, price: number) => {},
  deleteMovieFromLibrary: (id: string) => {},
});

export default function App({ Component, pageProps }: AppProps) {
  function reducer(state: LoginValues, action: any) {
    switch (action.type) {
      case "login": {
        return {
          ...state,
          logged: true,
          email: action.payload,
        };
      }
      case "logout": {
        localStorage.clear();
        return {
          ...state,
          logged: false,
          username: "",
          movies: [],
          email: "",
        };
      }
      case "setName": {
        return {
          ...state,
          username: action.payload,
        };
      }
      case "loadMovies": {
        return {
          ...state,
          movies: action.payload,
        };
      }
      default:
        throw new Error("Unknown action.");
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const login = (email: string) => {
    dispatch({ type: "login", payload: email });
  };

  const logout = () => {
    dispatch({ type: "logout" });
  };

  const setName = (name: LoginValues["username"]) => {
    dispatch({ type: "setName", payload: name });
  };

  const loadMovies = (movies: LoginValues["movies"]) => {
    dispatch({ type: "loadMovies", payload: movies });
  };

  const [library, setLibrary] = useState<(string | number)[][]>([]);

  const addMovieToLibrary = (id: string, title: string, price: number) => {
    setLibrary((prevLibrary) => [...prevLibrary, [id, title, price]]);
  };

  const deleteMovieFromLibrary = (id: string) => {
    setLibrary((prevLibrary) => {
      const newLibrary = prevLibrary.filter((movie) => movie[0] !== id);
      return newLibrary;
    });
  };

  return (
    <LoginContext.Provider value={state}>
      <LoginUpdateContext.Provider
        value={{ login, logout, setName, loadMovies }}
      >
        <LibraryContext.Provider
          value={{ library, deleteMovieFromLibrary, addMovieToLibrary }}
        >
          <Component {...pageProps} />
        </LibraryContext.Provider>
      </LoginUpdateContext.Provider>
    </LoginContext.Provider>
  );
}
