import React, { useContext} from "react";
import { Link } from "react-router-dom";
import { EmailContext } from "./EmailContext";
import "./Navbar.css";
const Navbar = () => {

    const { email } = useContext(EmailContext);
    
    return (
        <div className="Navbar">

            <div className="navbar_heading">
                <h1>Career Canvas</h1>
            </div>

            <div className="links">
                <Link to='/home'>Home </Link>
                <Link to='/apply'>Submit </Link>
                <Link to='/jobs'>Jobs </Link>
                <Link to='/review'>Review CVs </Link>
                <Link to='/contact'>Contact Us </Link>
                <Link to='/profile'>Profile </Link>
            </div>

        </div>
    )
}

export default Navbar;