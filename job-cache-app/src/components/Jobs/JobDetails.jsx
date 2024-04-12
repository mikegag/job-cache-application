import React, { useState, useEffect } from "react"
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"

export default function JobDetails() {
    const [inputs, setInputs] = useState({})
    const [applicationDetails, setApplicationDetails] = useState({})
    const [applicationUpdated, setApplicationUpdated] = useState(false)
    const { id } = useParams()

    const handleChange = (event) => {
        const { name, value } = event.target
        setInputs(prevState => ({ ...prevState, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const controller = new AbortController()
        const signal = controller.signal
        try {
            const response = await fetch(`/job/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs),
                signal
            })
            if (response.ok) {
                const data = await response.json()
                setApplicationDetails(data)
                setInputs({})
                setApplicationUpdated(true)
            } else {
                console.error("Application Update failed")
            }
        } catch (error) {
            console.error("Error:", error)
        } finally {
            controller.abort()
        }
    }
    
    const getSelectedApplication = async (signal) => {
        try {
            const response = await fetch(`/job/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                signal
            })
            if (response.ok) {
                const data = await response.json()
                setApplicationDetails(data)
            } else {
                console.error("Failed to Retrieve Application Details")
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        getSelectedApplication(signal)
        return () => {
            controller.abort()
        }
    }, [applicationUpdated])

    function updateStatusStyling(status) {
        if (status && status.includes && typeof status.includes === 'function') {
            if (status.includes('pending')) {
                return { background: "#ffc445" }
            } else if (status.includes('accepted')) {
                return { background: "#3F9F00", color: "#fffdf8" }
            } else {
                return { background: "#303e4d", color: "#fffdf8" }
            }
        } else {
            return {  background: "#ffc445" }
        }
    }
    
    const containerStyling = {
        margin:"4em auto 1em auto"
    }

    const applicationContainerStyling = {
        background:"#fcf7eb",
        borderRadius:"10px",
        border:"0.5px solid #303e4d",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        margin:"2em auto",
        padding:"1em"
    }

    const titleContainerStyling = {
        display:"flex",
        flexDirection:"row"
    }

    const mainTitleStyling = {
        margin:"auto auto auto 0",
        textAlign:"left",
        fontWeight:"500"
    }

    const linkStyling = {
        textDecoration:"none",
        margin:"auto 0 auto auto",
        color:"#303e4d",
        fontSize:"1.25rem"
    }

    const jobInfoContainerStyling = {
        ...titleContainerStyling,
        borderBottom:"0.5px solid #303e4d",
        fontSize:"0.9rem",
        fontWeight:"600"
    }

    const leftJobInfoContainerStyling = {
        padding:"0 1em 0.75em 1em",
        minWidth: "140px",
        margin:"0 auto auto 0",
        textAlign:"left",
        textOverflow:"ellipsis",
        wordBreak:"break-word"
    }

    const rightJobInfoContainerStyling = {
        padding:"0 0 0.75em 1em",
        minWidth: "110px",
        margin:"0 auto auto 0",
        textAlign:"left",
    }

    const dividerStyling = {
        borderLeft:"0.5px solid #303e4d", 
        width:"2px"
    }

    const statusStyling = {
        borderRadius:"20px",
        background: "#ffc445",
        padding:"0.3em 0.8em",
        width:"min-content"
    }

    const labelStyling = {
        display:"flex",
        flexDirection:"column",
        margin:"0 1em 1em 0",
        fontSize:"0.9rem"
    }

    const formContainerStyling = {
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexWrap:"wrap",
        margin:"1.5em auto 0.5em auto"
    }

    const inputStyling = {
        margin:"1em auto 1em 0",
        fontSize:"0.85rem",
        padding:"0.75em",
        borderRadius:"10px",
        background:"#fffdf8",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        border:"0.5px solid #303e4d",
        fontFamily:"Montserrat, sans-serif"
    }

    const buttonStyling = {
        background: "#303e4d",
        margin:"2em auto",
        width: "160px",
        padding: "0.75em 1.5em",
        border: "none",
        borderRadius: "10px",
        color: "#fffdf8",
        fontFamily: "Montserrat, sans-serif",
        fontSize:"1rem",
        cursor:"pointer"
    }

    const buttonContainerStyling = {
        width:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    }

    return (
        <div className="job-details-component" style={containerStyling}>
           <div style={titleContainerStyling}>
                <h3 style={mainTitleStyling}>Job Applications</h3>
                <Link to="/job" style={linkStyling}>
                    <FontAwesomeIcon icon={faArrowLeftLong} className="form-navigation-icon" />
                </Link>
            </div>
            <div style={applicationContainerStyling}>
                <div className="job-details-info-section" style={jobInfoContainerStyling}>
                    <div className="details-info-left" style={leftJobInfoContainerStyling}>
                        <p>{applicationDetails.position}</p>
                        <p>@{applicationDetails.company}</p>
                        <p>{applicationDetails.website}</p>
                    </div>
                    <div style={dividerStyling}></div>
                    <div className="details-info-right" style={rightJobInfoContainerStyling}>
                        <p>{applicationDetails.jobID}</p>
                        <p>{applicationDetails.applicationDate}</p>
                        <div style={{...statusStyling, ...updateStatusStyling(applicationDetails.status)}}>
                            {applicationDetails.status}
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} style={formContainerStyling}>
                    <label style={labelStyling}> Position
                        <input 
                            type="text" 
                            name="position"
                            value={inputs.position || ""} 
                            onChange={handleChange}
                            style={{...inputStyling, width:"270px"}}
                            className="form-input"
                            autoComplete="off"
                        />
                    </label>
                    <label style={labelStyling}> Company
                        <input 
                            type="text" 
                            name="company"
                            value={inputs.company || ""} 
                            onChange={handleChange}
                            style={{...inputStyling, width:"270px"}}
                            className="form-input"
                            autoComplete="off"
                        />
                    </label>
                    <label style={labelStyling}> Company Website
                        <input 
                            type="url" 
                            name="website"
                            value={inputs.website || ""} 
                            onChange={handleChange}
                            style={{...inputStyling, width:"140px"}}
                            className="form-input"
                            autoComplete="off"
                        />
                    </label>
                    <label style={labelStyling}> Job ID
                        <input 
                            type="text" 
                            name="jobID"
                            value={inputs.jobID || ""} 
                            onChange={handleChange}
                            style={{...inputStyling, width:"90px"}}
                            className="form-input"
                            autoComplete="off"
                        />
                    </label>
                    <label style={labelStyling}> Application Date
                        <input 
                            type="date" 
                            name="applicationDate"
                            value={inputs.applicationDate || ""} 
                            onChange={handleChange}
                            style={{...inputStyling, width:"130px"}}
                            className="form-input"
                            autoComplete="off"
                        />
                    </label>
                    <label style={labelStyling}> Status
                        <select
                            
                            name="status"
                            value={inputs.status || ""} 
                            onChange={handleChange}
                            style={{...inputStyling, width:"120px"}}
                            className="form-input"
                        >
                            <option value="-">------</option>
                            <option value="pending">Pending</option>
                            <option value="denied">Denied</option>
                            <option value="accepted">Accepted</option>
                        </select>
                    </label>
                    <div style={buttonContainerStyling}>
                        {applicationUpdated ?
                            <p>Application has been successfully updated!</p>
                        :
                            <input type="submit" value="Update" style={buttonStyling} className="form-btn"/>
                        }   
                    </div>
                </form>
            </div>
        </div>
    )
}
