import React from "react";
import { useRouteError } from "react-router-dom";

function Error() {
    //The Error component can be used to handle the error if any error is catched by the react-router-dom
    //currently we're not using the error component
    const error = useRouteError();
    console.log(error);
    return (
        <>
            <h1>Error Found</h1>
        </>
    )
}

export { Error }