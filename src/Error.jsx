import React from "react";
import { useRouteError } from "react-router-dom";

function Error() {

    const error = useRouteError();
    console.log(error);
    return (
        <>
            <h1>Error Found</h1>
        </>
    )
}

export { Error }