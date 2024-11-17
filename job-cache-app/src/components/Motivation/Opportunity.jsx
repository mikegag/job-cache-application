import React, { useState, useRef, useEffect } from "react";

export default function Opportunity() {
    const viewedOpportunity = useRef(true);
    const [jobOpportunity, setJobOpportunity] = useState(() => {
        // Retrieve the job opportunity from local storage on initial render
        const storedJobOpportunity = localStorage.getItem("jobOpportunity");
        return storedJobOpportunity ? JSON.parse(storedJobOpportunity) : null;
    });

    function sortResults(data) {
        return data.filter(current => (
            !current.role.toLowerCase().includes("director") && 
            !current.role.toLowerCase().includes("sales")
        ));
    };

    function randomIndex() {
        return Math.floor(Math.random()*3);
    };

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
            //     const selectedOpportunity = sortResults(responseData.results)[randomIndex()];
            //     setJobOpportunity(selectedOpportunity);
            //     localStorage.setItem("jobOpportunity", JSON.stringify(selectedOpportunity));
            //     localStorage.setItem("lastJobOpportunityTime", Date.now());
            // } else {
            //     console.error("failed to retrieve job opportunity");
            // }

                const results = responseData?.results || [];
                const filteredResults = sortResults(results);
                if (filteredResults.length > 0) {
                    const selectedOpportunity = filteredResults[randomIndex()];
                    setJobOpportunity(selectedOpportunity);
                    localStorage.setItem("jobOpportunity", JSON.stringify(selectedOpportunity));
                    localStorage.setItem("lastJobOpportunityTime", Date.now());
                } else {
                    console.error("No valid job opportunities found.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // useEffect(() => {
    //     const lastJobOpportunityTime = localStorage.getItem('lastJobOpportunityTime');
    //     const currentTime = Date.now();
    //     const timeElapsed = lastJobOpportunityTime ? currentTime - lastJobOpportunityTime : 0
    
    //     if (viewedOpportunity.current || timeElapsed >= 1000 * 60 * 60 * 168) {
    //         getJobOpportunity()
    //         viewedOpportunity.current = true
    //     }
    
    //     const intervalId = setInterval(() => {
    //     }, 1000 * 60 * 60 * 168 - timeElapsed)
    
    //     return () => {
    //         clearInterval(intervalId)
    //         viewedOpportunity.current = false;
    //     }
    // }, [viewedOpportunity.current]);

    useEffect(() => {
        const lastJobOpportunityTime = parseInt(localStorage.getItem("lastJobOpportunityTime"), 10);
        const currentTime = Date.now();
        const timeElapsed = lastJobOpportunityTime ? currentTime - lastJobOpportunityTime : Infinity;
    
        if (viewedOpportunity.current || timeElapsed >= 1000 * 60 * 60 * 168) {
            getJobOpportunity();
            viewedOpportunity.current = false; // Mark as viewed
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

