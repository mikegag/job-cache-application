import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

export default function NewJob() {
    // State to toggle form visibility
    const [open, setOpen] = useState(false);
    // State to manage form inputs
    const [inputs, setInputs] = useState({});
    // State to display a success message
    const [applicationAdded, setApplicationAdded] = useState(false);

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevState => ({ ...prevState, [name]: value }));
    }
  
     // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/job/newJob", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs)
            });
    
            if (response.ok) {
                setInputs({});
                setApplicationAdded(true);
                setTimeout(() => {
                    setApplicationAdded(false);
                }, 4000);
            } else {
                console.error("Failed to save new application");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };    

    // Styling for various components
    const containerStyling = {
        margin:"4em auto 1em auto"
    };

    const applicationContainerStyling = {
        background:"#fcf7eb",
        borderRadius:"10px",
        border:"0.5px solid #303e4d",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        margin:"2em auto",
        padding:"1em"
    };

    const titleContainerStyling = {
        display:"flex",
        flexDirection:"row"
    };

    const mainTitleStyling = {
        margin:"auto auto auto 0",
        textAlign:"left",
        fontWeight:"500"
    };

    const linkStyling = {
        textDecoration:"none",
        margin:"auto 0 auto auto",
        color:"#303e4d",
        fontSize:"1.25rem"
    };

    const jobInfoContainerStyling = {
        ...titleContainerStyling,
        borderBottom:"0.5px solid #303e4d",
        fontSize:"0.9rem",
        fontWeight:"600"
    };

    const leftJobInfoContainerStyling = {
        padding:"0 1em 0.75em 1em",
        minWidth: "140px",
        margin:"0 auto auto 0",
        textAlign:"left",
        textOverflow:"ellipsis",
        wordBreak:"break-word"
    };

    const rightJobInfoContainerStyling = {
        padding:"0 0 0.75em 1em",
        minWidth: "110px",
        margin:"0 auto auto 0",
        textAlign:"left",
    };

    const dividerStyling = {
        borderLeft:"0.5px solid #303e4d", 
        width:"2px"
    };

    const statusStyling = {
        borderRadius:"20px",
        background:"#ffc445",
        padding:"0.3em 0.8em",
        width:"min-content"
    };

    const labelStyling = {
        display:"flex",
        flexDirection:"column",
        margin:"0 1.15em 1em 0",
        fontSize:"0.9rem"
    };

    const formContainerStyling = {
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexWrap:"wrap",
        margin:"1.5em auto 0.5em auto"
    };

    const inputStyling = {
        margin:"1em auto 1em 0",
        fontSize:"0.85rem",
        padding:"0.75em",
        borderRadius:"10px",
        background:"#fffdf8",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        border:"0.5px solid #303e4d",
        fontFamily:"Montserrat, sans-serif"
    };

    const buttonStyling = {
        background: "#303e4d",
        margin:"2em auto 1em auto",
        width: "160px",
        padding: "0.75em 1.5em",
        border: "none",
        borderRadius: "10px",
        color: "#fffdf8",
        fontFamily: "Montserrat, sans-serif",
        fontSize:"1rem",
        cursor:"pointer"
    };

    const buttonContainerStyling = {
        width:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    };

    const showButtonStyling = {
        ...buttonStyling,
        display: "block"
    };
    
    const hideButtonStyling = {
        ...buttonStyling,
        display: "none"
    };

    return (
        <div className="new-job-component" style={containerStyling}>
           <div style={titleContainerStyling}>
                <h3 style={mainTitleStyling}>Job Applications</h3>
                <Link to="/job" style={linkStyling}>
                    <FontAwesomeIcon icon={faArrowLeftLong} className="form-navigation-icon"/>
                </Link>
            </div>
            <section style={applicationContainerStyling}>
                <div className="new-job-info-section" style={jobInfoContainerStyling}>
                    {/* Left Job Information */}
                    <div className="job-info-left" style={leftJobInfoContainerStyling}>
                        <p>Position</p>
                        <p>@Company</p>
                        <p>Company Website</p>
                    </div>

                    <div style={dividerStyling} role="presentation"></div>
                    
                    {/* Right Job Information */}
                    <div className="job-info-right" style={rightJobInfoContainerStyling}>
                        <p>Job ID</p>
                        <p>Application Date</p>
                        <div style={statusStyling}>Status</div>
                    </div>
                </div>
                <button 
                    onClick={() => setOpen(prev => !prev)} 
                    style={!open? showButtonStyling:hideButtonStyling}
                    className="form-btn"
                    aria-expanded={open}
                    aria-controls="add-job-form"
                > 
                    Add Job
                </button>

                {/* Add Job Form */}
                {open &&
                    <form id="add-job-form" onSubmit={handleSubmit} style={formContainerStyling}>
                        <label style={labelStyling}> Position
                            <input 
                                id="position"
                                type="text" 
                                name="position"
                                value={inputs.position || ""} 
                                onChange={handleChange}
                                required
                                style={{...inputStyling, width:"270px"}}
                                className="form-input"
                                autoComplete="on"
                                maxLength={60}
                            />
                        </label>
                        <label style={labelStyling}> Company
                            <input 
                                id="company"
                                type="text" 
                                name="company"
                                value={inputs.company || ""} 
                                onChange={handleChange}
                                required
                                style={{...inputStyling, width:"270px"}}
                                className="form-input"
                                autoComplete="on"
                                maxLength={40}
                            />
                        </label>
                        <label style={labelStyling}> Company Website
                            <input 
                                id="website"
                                type="url" 
                                name="website"
                                value={inputs.website || ""} 
                                onChange={handleChange}
                                style={{...inputStyling, width:"140px"}}
                                className="form-input"
                                autoComplete="on"
                                maxLength={200}
                            />
                        </label>
                        <label style={labelStyling}> Job ID
                            <input 
                                id="jobID"
                                type="text" 
                                name="jobID"
                                value={inputs.jobID || ""} 
                                onChange={handleChange}
                                style={{...inputStyling, width:"90px"}}
                                className="form-input"
                                autoComplete="on"
                                maxLength={25}
                            />
                        </label>
                        <label style={labelStyling}> Application Date
                            <input
                                id="applicationDate"
                                type="date" 
                                name="applicationDate"
                                value={inputs.applicationDate || ""} 
                                onChange={handleChange}
                                required
                                style={{...inputStyling, width:"130px"}}
                                className="form-input"
                                autoComplete="on"
                            />
                        </label>
                        <label style={labelStyling}> Status
                            <select
                                name="status"
                                value={inputs.status || ""} 
                                onChange={handleChange}
                                required
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
                            {applicationAdded ?
                                <p>
                                    Application has been successfully added!
                                </p>
                            :
                                <input type="submit" value="Add Job" style={buttonStyling} className="form-btn"/>
                            }
                        </div>
                    </form>
                }
            </section>
        </div>
    )
}
