import React from "react";
import { useEffect } from "react";
import Header from "../components/Header";
import NewJob from "../components/Jobs/NewJob";

export default function AddNewJob() {
    useEffect(() => {
        document.title = "JobCache - New Application"
    }, []);

    return (
        <div className="add-new-job-page">
            <Header 
                secondButtonText={"MOTIVATE"}
                thirdButtonText={"LOG OUT"}  
            />
            <NewJob />
        </div>
    )
}

