import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { TailSpin } from 'react-loader-spinner';

export default function JobList() {
    const [applicationList, setApplicationList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const setCookieWithSameSite = (name, value) => {
        document.cookie = `${name}=${value}; SameSite=None; Secure`
    }     

    const getApplications = async (signal) => {
        try {
            const sessionToken = localStorage.getItem('user_id')
            if (!sessionToken) {
                throw new Error('Session token not found in localStorage');
            }
            setCookieWithSameSite('session', sessionToken) 

            const response = await fetch("/job", {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Request-Method": "GET", 
                    "Access-Control-Request-Headers": "Content-Type",
                    "Authorization": `Bearer ${sessionToken}`,
                    "Cache-Control": "no-cache",
                    "Accept-Encoding": "gzip, deflate",
                },
                signal
            });
            if (response.ok) {
                const data = await response.json();
                setApplicationList(data);
                setIsLoading(false);
            } else {
                console.error("Failed to retrieve Application List");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        getApplications(signal)
    
        return () => {
            controller.abort()
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (applicationList.length === 0) {
                setIsLoading(false)
            }
        }, 3500);

        return () => clearTimeout(timeout)
    }, [applicationList]);

    function updateStatusStyling(status) {
        if (status.includes('pending')) {
            return { background: "#ffc445" };
        } else if (status.includes('accepted')) {
            return { background: "#3F9F00", color: "#fffdf8" };
        } else {
            return { background: "#303e4d", color: "#fffdf8" };
        }
    };

    const containerStyling = {
        margin:"4em auto 1em auto"
    };

    const infoContainerStyling = {
        display:"flex",
        flexDirection:"row"
    };

    const mainIconStyling = {
        margin:"auto 0 auto auto",
        cursor:"pointer"
    };

    const mainTitleStyling = {
        margin:"auto auto auto 0",
        textAlign:"left",
        fontWeight:"500"
    };

    const applicationContainerStyling = {
        background:"#fcf7eb",
        borderRadius:"10px",
        border:"0.5px solid #303e4d",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        margin:"2em auto",
        overflow:"scroll",
        maxHeight:"430px"
    };
    
    const applicationStyling = {
        background:"#fcf7eb",
        borderBottom:"0.5px solid #303e4d",
        padding:"0.75em 0.5em",
        display:"flex",
        color: "#303e4d",
        textDecoration: "none"
    };

    const applicationLinkStyling = {
        textDecoration:"none",
        cursor:"pointer"
    };

    const applicationIconStyling = {
        margin:"auto"
    };

    const linkStyling = {
        textDecoration:"none",
        margin:"auto 0 auto auto",
        color:"#303e4d",
        fontSize:"1.25rem"
    };

    const statusStyling = {
        background:"#ffc445",
        borderRadius:"20px",
        padding:"0.35em 1em",
        width:"min-content",
        fontSize:"0.8rem",
        margin:"auto"
    };

    const applicationInfoStyling = {
        display:"flex",
        flexDirection:"column",
        margin:"auto",
        justifyContent:"center",
        alignItems:"center",
    };

    const InfoPositionStyling = {
        margin:"0.25em auto",
        fontSize:"0.9rem",
        fontWeight:"600"
    };

    const InfoCompanyStyling = {
        margin:"0.25em auto",
        fontSize:"0.9rem",
        fontWeight:"400"
    };

    const errorMessageStyling = {
        textAlign:"center",
        margin:"5em auto 1em auto"
    };

    return (
        <section className="job-list-component" style={containerStyling}>
                <div style={infoContainerStyling}>
                    <h3 style={mainTitleStyling}>Job Applications</h3>
                    <Link to="newJob" style={linkStyling}>
                        <FontAwesomeIcon icon={faPlusCircle} style={mainIconStyling} className="form-navigation-icon" />
                    </Link>
                </div>
            { isLoading ? 
            (
                <div style={{...applicationInfoStyling, margin:"3em auto"}}>
                    <TailSpin
                        visible={true}
                        height="50"
                        width="50"
                        color="#303e4d"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                    />
                </div>
            ) 
            : 
            (
                applicationList.length === 0 ? 
                (
                    <p style={errorMessageStyling}>No applications to be displayed. Start adding some!</p>
                ) 
                : 
                (
                    <article style={applicationContainerStyling}>
                        {applicationList.map(current => (
                            <Link key={current.jobID} to={`${current.company}-${current.jobID}`} style={applicationLinkStyling}>
                                <div style={applicationStyling} className="job-list-application">
                                    <div style={{ ...applicationInfoStyling, width: "150px", textAlign: "center" }}>
                                        <p style={InfoPositionStyling}>{current.position}</p>
                                        <p style={InfoCompanyStyling}>@{current.company}</p>
                                    </div>
                                    <div style={{ ...statusStyling, ...updateStatusStyling(current.status) }}>
                                        {current.status}
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} style={applicationIconStyling} />
                                </div>
                            </Link>
                        ))}
                    </article>
                )
            )}
        </section>
    )
}
