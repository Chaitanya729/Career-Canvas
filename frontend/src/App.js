//import './App.css';
import Home from "./components/Home"
import Login from './components/Login';
import Signup from "./components/Signup"
import Apply from "./Apply";
import Navbar from "./Navbar"
import Review from "./Review";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Apply.css";

function App() {
  return (
    <div className="App">
      <Router>
        <RoutesWithNavbar />
      </Router>
    </div>
  );
}

function RoutesWithNavbar() {
  let location = useLocation();
  let showNavbar = location.pathname !== "/" && location.pathname !== "/signup";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path='/review' element={<Review />} />
      </Routes>
    </>
  );
}

export default App;