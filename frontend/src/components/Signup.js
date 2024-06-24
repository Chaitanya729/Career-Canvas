import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { EmailContext } from "../EmailContext";
import './Signup.css'

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [age, setAge] = useState(0)

    const { setEmail: setInputEmail } = useContext(EmailContext);

    async function submit(e) {
        e.preventDefault();

        try {

            await axios.post("http://localhost:5000/signup", {
                email, password, name, age
            })
                .then(res => {
                    if (res.data == "Already Exists") {
                        alert("User already exists !!!")
                    }
                    else if (res.data == "Succesful") {
                        setInputEmail(email)
                        navigate("/home")
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

        <div className="Sign Up">
            <div className="Heading">
                <center>
                    <h1>Career Canvas</h1>
                </center>
            </div>
            <center>

                <h2>Sign Up</h2>
                <form action="POST">
                    <input
                        type="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        placeholder="Email"
                        name="email"
                        id="emailInput"
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
                    <input
                        type="text"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        placeholder="Name"
                        name="name"
                        id="nameINput"
                    />
                    <input
                        type="number"
                        onChange={(e) => {
                            setAge(e.target.value);
                        }}
                        placeholder="Age"
                        name="age"
                        id="ageINput"
                    />
                    <br />
                    <input type="submit" onClick={submit} />
                </form>
            </center>

            <center>
                <br />
                <p>OR</p>
                <br />
                <input type="button" value="Login" onClick={() => { navigate("/") }} />
            </center>
        </div>
    );
}

export default Login;
