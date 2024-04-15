import React from "react";
import ReactDOM from 'react-dom/client';
import { App } from "./src/App";

const root = document.querySelector("#root"); //Storing the div with id root in root variable

ReactDOM.createRoot(root).render(<App />); //using the createRoot function to specify where to render the JSX elements in the DOM and giving the main component i.e. App component