import React from "react"
import { useState, useRef, useEffect } from "react"


export default function Opportunity() {
    const viewedOpportunity = useRef(true)
    const [jobOpportunity, setJobOpportunity] = useState(() => {
        // Retrieve the job opportunity from local storage on initial render
        const storedJobOpportunity = localStorage.getItem("jobOpportunity")
        return storedJobOpportunity ? JSON.parse(storedJobOpportunity) : null
    })

    function sortResults(data) {
        return data.filter(current => (
            !current.role.toLowerCase().includes("director") && 
            !current.role.toLowerCase().includes("sales")
        ))
    }

    function randomIndex() {
        return Math.floor(Math.random()*3)
    }

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
            })    
            if (response.ok) {
                const responseData = await response.json()
                const selectedOpportunity = sortResults(responseData.results)[randomIndex()]
                setJobOpportunity(selectedOpportunity)
                localStorage.setItem("jobOpportunity", JSON.stringify(selectedOpportunity))
                localStorage.setItem("lastJobOpportunityTime", Date.now())
            } else {
                console.error("failed to retrieve job opportunity")
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    useEffect(() => {
        const lastJobOpportunityTime = localStorage.getItem('lastJobOpportunityTime')
        const currentTime = Date.now()
        const timeElapsed = currentTime - lastJobOpportunityTime
        //refreshes once a week
        if (!viewedOpportunity.current || timeElapsed >= 1000 * 60 * 60 * 168) {
          getJobOpportunity()
          viewedOpportunity.current = true
        }
        const intervalId = setInterval(() => {
          getJobOpportunity()
        }, 1000 * 60 * 60 * 168 - timeElapsed)
    
        return () => {
            clearInterval(intervalId)
            viewedOpportunity.current = false
        }
    }, [])

    const positionTitleStyling = {
        fontSize:"0.9rem",
        margin:"1em auto",
        fontWeight:"500"
    }

    const JobLinkStyling = {
        cursor:"pointer",
        color:"inherit",
        textDecoration:"underline"
    }

    return (
        <>
            {jobOpportunity!=null ? 
                (
                    <>
                    <h5 style={positionTitleStyling}>{jobOpportunity.role}</h5>
                    <p>@{jobOpportunity.company_name}</p>
                    <a 
                        href={jobOpportunity.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={JobLinkStyling}
                    >
                        <p>View Job Opportunity</p>
                    </a>
                    </>
                )
                :
                    <p>Try again later to view future Job Opportunities!</p>
                }
        </>
    )
}

