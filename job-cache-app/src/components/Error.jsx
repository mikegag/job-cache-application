import React from "react";

export default function Error() {
    const messageStyling = {
        margin:"6em auto",
        padding:"0 1em",
        textAlign:"center",
        fontSize:"1.5rem"
    };

    return (
        <div className="error-component">
            <h4 style={messageStyling}>Oops! Looks like something went wrong. Please try again.</h4>
        </div>
    )
}

