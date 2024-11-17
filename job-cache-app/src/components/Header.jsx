import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header(props) {
    const navigate = useNavigate();
    // Handle logout action
    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Navigate to login and clear user session
                navigate('/')
                localStorage.removeItem("user_id")
            } else {
                console.error('Logout failed')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    };

    // Inline styles for layout and elements
    const containerStyling = {
        display:"flex",
    };

    const firstLinkStyling = {
        margin:"auto auto auto 0"
    };

    const secondLinkStyling = {
        margin:"auto 1em auto auto"
    };

    const thirdLinkStyling = {
        margin:"auto 0"
    };
    const buttonStyling = {
        padding: "0.5em 1.25em",
        border: "1px solid #303E4D",
        background: "#FFC445",
        color: "#303E4D",
        borderRadius:"10px",
        cursor:"pointer",
        margin: "auto"
       
    };

    const logoStyling = {
        border:"none",
        padding:"0",
        margin:"auto auto auto 0",
        height:"50px",
        cursor:"pointer"
    };

    const imageStyling = {
        width:"60px"
    };

    return (
        <div className="header-component" style={containerStyling}>
           {props.icon? 
                (
                <Link to={"/"} style={firstLinkStyling}>
                    <button 
                        style={logoStyling}
                        aria-label={`button that redirects to Home page `}
                    >
                        <img 
                            src={props.icon} 
                            alt="JobCache logo" 
                            style={imageStyling}
                        />
                    </button> 
                </Link>
                )
            : 
                (   
                <Link to={"/job"} style={firstLinkStyling}>
                    <button 
                        aria-label={`button that redirects to Jobs page`}
                        style={buttonStyling}
                    > 
                        <FontAwesomeIcon 
                            icon={faFolder} 
                            style={{marginRight:"0.5em"}} 
                        /> 
                        JOBS 
                    </button> 
                </Link>
                )
            }
            <Link 
                to={props.secondButtonText && props.icon? 
                    `/${props.secondButtonText.replace(/\s/g, "").toLowerCase()}` 
                    : 
                    `/job/${props.secondButtonText.replace(/\s/g, "").toLowerCase()}` 
                }
                style={secondLinkStyling}>
                <button 
                    aria-label={`button that redirects to ${props.secondButtonText} page`} 
                    style={buttonStyling}
                >
                    {props.secondButtonText}
                </button>
            </Link>
            <Link 
                to={props.thirdButtonText ? 
                    `/${props.thirdButtonText.replace(/\s/g, "").toLowerCase()}`
                    : 
                    "/"
                }
                style={thirdLinkStyling}>
                <button 
                    aria-label={`button that redirects to ${props.thirdButtonText} page`} 
                    style={buttonStyling}
                    onClick={props.thirdButtonText.replace(/\s/g, "").toLowerCase() === "logout" ? handleLogout : null}
                >
                    {props.thirdButtonText}
                </button>
            </Link>
        </div>
    );
}

