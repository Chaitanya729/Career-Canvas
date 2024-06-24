import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { EmailContext } from "../EmailContext";
import './Login.css'

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setEmail : setInputEmail } = useContext(EmailContext);

    async function submit(e) {
        e.preventDefault();

        try {

            await axios.post("http://localhost:5000/", {
                email, password
            })
                .then(res => {
                    if (res.data == "Exists") {
                        setInputEmail(email)
                        navigate("/home")
                    }

                    else if (res.data == "Does not exist") {
                        alert("User not found !!! Sign up if new.")
                    }
                    else if (res.data == "Password Incorrect") {
                        alert("Password Incorrect !!!")
                    }
                    else if (res.data == "Invalid") {
                        alert("Invalid data")
                    }
                })
                .catch(e => {
                    alert("Wrong details")
                    console.log(e)
                }
                )
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        
        <div className="login">
            <center> 
                <div className="Heading">
                    <h1>Career Canvas</h1>
                    <p>Where Resumes Lead to Milestones</p>
                </div>
            </ center>
            <h2>Login</h2>
            <form action="POST">
                <input
                    type="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="Email"
                    name="email"
                    id="emailINput"
                />
                <input
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="Password"
                    name="password"
                    id="passwordInput"
                />

                <center>
                    <input type="submit" onClick={submit} />
                </center>
            </form>
            
            <center>
                <br />
                
                <p>OR</p>
                <br />

                <input type="button" value="Sign Up" onClick={() => navigate("signup")} />
            </center>
        </div>
    );
}

export default Login;
