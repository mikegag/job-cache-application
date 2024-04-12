import React from "react"
import { useEffect } from "react"
import Header from "../components/Header"
import JobList from "../components/Jobs/JobList"

export default function Job() {
    useEffect(() => {
        document.title = "JobCache - Application List"
    }, []) 
    return (
        <div className="job-page">
            <Header 
                secondButtonText={"MOTIVATE"}
                thirdButtonText={"LOG OUT"}  
            />
            <div className="job-info-section">
                <JobList />
            </div>
        </div>
    )
}

