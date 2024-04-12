import React from "react"
import Header from "../components/Header"
import Quote from "../components/Motivation/Quote"
import Opportunity from "../components/Motivation/Opportunity"
import { faSun, faBolt} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect} from "react"

export default function Home() {
    useEffect(() => {
        document.title = "JobCache - Motivation"
    }, [])

    const infoSectionStyling = {
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"column",
        margin:"4em auto 1em auto"
    }

    const messageContainerStyling = {
        background:"#fcf7eb",
        borderRadius:"10px",
        border:"0.5px solid #303e4d",
        padding:"0.5em 1em",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        margin:"auto",
        fontSize:"0.9rem",
        minWidth:"280px",
        textAlign:"center"
    }

    const titleStyling = {
        fontWeight:"500",
        fontSize:"1.17rem"
    }

    const iconStyling = {
        fontSize:"1.5rem",
        color:"#303e4d"
    }

    const dividerStyling = {
        height:"2px",
        background:"#303e4d",
        margin:"3em auto",
        width:"90%",
        borderRadius:"15px"
    }

    return (
        <div className="motivate-page">
            <Header 
                secondButtonText={"MOTIVATE"}
                thirdButtonText={"LOG OUT"}  
            />
            <div className="motivate-info-section" style={infoSectionStyling}>
                <FontAwesomeIcon icon={faSun} style={iconStyling}/>
                <h4 style={titleStyling}>Daily Motivational Quote</h4>
                <div className="quote-container" style={messageContainerStyling}>
                    <Quote />
                </div>
                <div className="motivate-info-section-divider" style={dividerStyling}></div>
                <FontAwesomeIcon icon={faBolt} style={{...iconStyling, rotate:"-10deg"}}/>
                <h4 style={titleStyling}>Weekly Job Opportunity</h4> 
                <div className="opportunity-container" style={messageContainerStyling}>
                    <Opportunity />
                </div>
            </div>
        </div>
    )
}

