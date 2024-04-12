import React from "react"
import { useEffect } from "react"
import Header from "../components/Header"
import JobDetails from "../components/Jobs/JobDetails"

export default function ViewJobDetails() {
    useEffect(() => {
        document.title = "JobCache - Application Details"
    }, []) 

    return (
        <div className="add-new-job-page">
            <Header 
                secondButtonText={"MOTIVATE"}
                thirdButtonText={"LOG OUT"}  
            />
            <JobDetails />
        </div>
    )
}

