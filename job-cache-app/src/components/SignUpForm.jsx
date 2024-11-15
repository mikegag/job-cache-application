import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"
import { TailSpin } from 'react-loader-spinner'

export default function SignUpForm() {
    // State for storing form input values
    const [inputs, setInputs] = useState({})
    // State to track if signup failed
    const [failedSignUp, setFailedSignUp] = useState(false)
    // State to track if signup succeeded
    const [successfulSignUp, setSuccessfulSignUp] = useState(false)
    const navigate = useNavigate()

    // Handle input value changes and update state
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((values) => ({ ...values, [name]: value }));
    };
    
    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs)
            });

            if (response.ok) {
                // Successful signup: show success message and navigate to login page
                setFailedSignUp(false);
                setSuccessfulSignUp(true);
                setTimeout(() => {navigate("/login")}, 2200);
            } else {
                // Failed signup: display error message
                console.error("Signup failed");
                setFailedSignUp(true);
            }
        } catch (error) {
            // Handle network or server errors
            console.error("Error:", error);
            // Navigate to a generic error page
            navigate("/*");
        }
    };

    // Inline styles for layout and elements
    const containerStyling = {
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"center"
    };

    const mainTitleStyling = {
        textAlign: "center",
        fontSize:"1.5rem",
        textDecoration:"underline",
        margin: "2em auto 1.5em auto",
    };

    const inputStyling = {
        margin:"1em auto 2em 0",
        fontSize:"0.9rem",
        padding:"1.25em 1.25em 1.25em 2.5em",
        width:"270px",
        borderRadius:"10px",
        background:"#fcf7eb",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        border:"0.5px solid #303e4d"
    };

    const iconStyling = {
        position: "absolute", 
        top: "42%", 
        left: "10px", 
        transform: "translateY(-50%)",
        opacity:"70%"
    };

    const buttonStyling = {
        background: "#303e4d",
        margin:"3em auto 1em auto",
        width: "270px",
        padding: "0.6em 2em",
        border: "none",
        borderRadius: "10px",
        color: "#fffdf8",
        fontFamily: "montserrat, sans-serif",
        fontSize:"1.25rem",
        cursor:"pointer"
    };

    const errorMessageStyling = {
        fontSize:"0.9rem",
        margin:"0 auto",
        fontWeight:"600",
        opacity:"0%"
    };

    const footerStyling = {
        margin:"1em auto",
        fontSize:"0.9rem"
    };

    const linkStyling = {
        color:"#303e4d"
    };

    const successMessageStyling = {
        margin:"4em auto 3em auto"
    };

    return (
        <div className="signup-form-component" style={containerStyling}>
            <h3 style={mainTitleStyling}>Create an Account</h3>
            {successfulSignUp === true?
                (<div style={containerStyling} role="status">  
                    <h5 style={successMessageStyling}>Success! Let's get you started...</h5>
                    <TailSpin
                        visible={true}
                        height="50"
                        width="50"
                        color="#303e4d"
                        ariaLabel="Loading spinner"
                        radius="1"
                    />
                </div>)
            :
                (<form onSubmit={handleSubmit} style={containerStyling}>
                    <label htmlFor="username"> Username
                        <div style={{position: "relative" }}>
                            <FontAwesomeIcon icon={faUser} style={iconStyling}/>
                            <input
                                id="username"
                                style={inputStyling}
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={inputs.username || ""}
                                onChange={handleChange}
                                required
                                autoComplete="on"
                            />
                        </div>
                    </label>
                    <label htmlFor="email"> Email
                        <div style={{position: "relative" }}>
                            <FontAwesomeIcon icon={faEnvelope} style={iconStyling}/>
                            <input
                                id="email"
                                style={inputStyling}
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={inputs.email || ""}
                                onChange={handleChange}
                                autoComplete="on"
                                required
                            />
                        </div>
                    </label>
                    <label> Password
                        <div style={{position: "relative" }}>
                            <FontAwesomeIcon icon={faLock} style={iconStyling}/>
                            <input
                                style={inputStyling}
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={inputs.password || ""}
                                onChange={handleChange}
                                autoComplete="on"
                                minLength={7}
                                required
                            />
                        </div>
                    </label>
                    <p style={{...errorMessageStyling, opacity: failedSignUp ? "100%" : "0%" }}>
                        Username or Email already exists. Try again!
                    </p>
                    <input type="submit" value="Sign Up" style={buttonStyling} className="form-btn"/>
                    <p style={footerStyling}>
                        Already have an account? Welcome <Link to={"/login"} style={linkStyling}>back</Link>
                    </p>
                </form>)
            }
        </div>
    )
}
