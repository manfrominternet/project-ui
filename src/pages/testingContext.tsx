import { FunctionComponent, useContext } from "react";
import { LoginContext, LoginUpdateContext } from "./_app";

interface TestingContextProps {
    
}
 
const TestingContext: FunctionComponent<TestingContextProps> = () => {
    const boolValue = useContext(LoginContext);
    const updateValue = useContext(LoginUpdateContext);
    console.log(updateValue);
    console.log(boolValue);
    const click = () => {
        updateValue.login(),
        console.log(boolValue);
        updateValue.loadMovies(["gonna", "be", "okay"])
    }
    const unclick = () => {
        updateValue.logout(),
        console.log(boolValue);
    }
    return ( 
        <>
         Context
         {boolValue.logged ? "Yes" : "No"}
         <button onClick={click}> Klik! </button>
         <button onClick={unclick}> Klik! </button>
         <ul>
            {boolValue.movies.map(movie => <li>{movie}</li>) }
         </ul>
        </>
     );
}
 
export default TestingContext;