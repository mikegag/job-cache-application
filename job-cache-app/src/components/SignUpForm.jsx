import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"
import { TailSpin } from 'react-loader-spinner'

export default function SignUpForm() {
    const [inputs, setInputs] = useState({})
    const [failedSignUp, setFailedSignUp] = useState(false)
    const [successfulSignUp, setSuccessfulSignUp] = useState(false)
    const navigate = useNavigate()

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs)
            })

            if (response.ok) {
                setFailedSignUp(false)
                setSuccessfulSignUp(true)
                setTimeout(() => {navigate("/login")}, 2200)
            } else {
                console.error("Signup failed")
                setFailedSignUp(true)
            }
        } catch (error) {
            console.error("Error:", error)
            navigate("/*")
        }
    }

    const containerStyling = {
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"center"
    }

    const mainTitleStyling = {
        textAlign: "center",
        fontSize:"1.5rem",
        textDecoration:"underline",
        margin: "2em auto 1.5em auto",
    }

    const inputStyling = {
        margin:"1em auto 3em 0",
        fontSize:"0.9rem",
        padding:"1.25em 1.25em 1.25em 2.5em",
        width:"270px",
        borderRadius:"10px",
        background:"#fcf7eb",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        border:"0.5px solid #303e4d"
    }

    const iconStyling = {
        position: "absolute", 
        top: "37%", 
        left: "10px", 
        transform: "translateY(-50%)",
        opacity:"70%"
    }

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
    }

    const errorMessageStyling = {
        fontSize:"0.9rem",
        margin:"0 auto",
        fontWeight:"600",
        opacity:"0%"
    }

    const footerStyling = {
        margin:"1.5em auto 1em auto",
        fontSize:"0.9rem"
    }

    const linkStyling = {
        color:"#303e4d"
    }

    const successMessageStyling = {
        margin:"4em auto 3em auto"
    }

    return (
        <div className="signup-form-component" style={containerStyling}>
            <h3 style={mainTitleStyling}>Create an Account</h3>
            {successfulSignUp === true?
                (<div style={containerStyling}>  
                    <h5 style={successMessageStyling}>Success! Let's get you started...</h5>
                    <TailSpin
                        visible={true}
                        height="50"
                        width="50"
                        color="#303e4d"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                    />
                </div>)
            :
                (<form onSubmit={handleSubmit} style={containerStyling}>
                    <label> Username
                        <div style={{position: "relative" }}>
                            <FontAwesomeIcon icon={faUser} style={iconStyling}/>
                            <input
                                style={inputStyling}
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={inputs.username || ""}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </div>
                    </label>
                    <label> Email
                        <div style={{position: "relative" }}>
                            <FontAwesomeIcon icon={faEnvelope} style={iconStyling}/>
                            <input
                                style={inputStyling}
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={inputs.email || ""}
                                onChange={handleChange}
                                autoComplete="off"
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
                                autoComplete="off"
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
