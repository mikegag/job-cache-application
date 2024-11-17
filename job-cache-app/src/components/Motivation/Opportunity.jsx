import React, { useState, useRef, useEffect } from "react";

export default function Opportunity() {
    // State to store the current job opportunity
    const [jobOpportunity, setJobOpportunity] = useState(null);

    // Filters job results to exclude unwanted roles like "Director" or "Sales".
    function sortResults(data) {
        return data.filter(current => (
            !current.role.toLowerCase().includes("director") && 
            !current.role.toLowerCase().includes("sales")
        ));
    };

    // Helper function used to find a random job results index
    function randomIndex() {
        return Math.floor(Math.random()*10);
    };

    // Fetches a job opportunity from the FindWork.dev API
    const getJobOpportunity = async () => {
        try {
            const response = await fetch("/job/motivate", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Authorization": process.env.REACT_APP_FINDWORK_API_KEY,
                    "Accept":"application/json",
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                const results = responseData?.results || [];
                const filteredResults = sortResults(results);
                if (filteredResults.length > 0) {
                    const selectedOpportunity = filteredResults[randomIndex()];
                    setJobOpportunity(selectedOpportunity);
                    localStorage.setItem("lastJobOpportunityTime", Date.now());
                } else {
                    console.error("No valid job opportunities found.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Effect hook to handle job opportunity fetch logic
    useEffect(() => {
        const lastJobOpportunityTime = parseInt(localStorage.getItem("lastJobOpportunityTime"), 10);
        const currentTime = Date.now();
        const timeElapsed = lastJobOpportunityTime ? currentTime - lastJobOpportunityTime : Infinity;
    
        // Fetch a new opportunity if the specified interval has passed
        if (timeElapsed >= 1000 * 60 * 60 * 168) {
            getJobOpportunity();
        }
    
        // Set up interval for refreshing job opportunities
        const intervalId = setInterval(getJobOpportunity, 1000 * 60 * 60 * 168);
    
        return () => clearInterval(intervalId);
    }, []);
    
    // Inline styles for layout and elements
    const positionTitleStyling = {
        fontSize:"0.9rem",
        margin:"1em auto",
        fontWeight:"500"
    };

    const JobLinkStyling = {
        cursor:"pointer",
        color:"inherit",
        textDecoration:"underline"
    };

    return (
        <>
            {jobOpportunity!=null ? 
                (
                    <div>
                        <h5 style={positionTitleStyling}>{jobOpportunity.role}</h5>
                        <p>@{jobOpportunity.company_name}</p>
                        <a 
                            href={jobOpportunity.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={JobLinkStyling}
                            title={`View job opportunity at ${jobOpportunity.company_name}`}
                        >
                            <p>View Job Opportunity</p>
                        </a>
                    </div>
                )
                :
                    <p>Try again later to view future Job Opportunities!</p>
                }
        </>
    )
}

