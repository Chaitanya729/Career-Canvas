import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { EmailContext } from './EmailContext';
import "./Review.css";

const Review = () => {
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); 
    const location = useLocation();

    const { email } = useContext(EmailContext);
    console.log(email)

    useEffect(() => {
        const fetchApplications = async () => {
            const { data } = await axios.get("http://localhost:5000/review"); 
            setApplications(data);
        };
        fetchApplications();
    }, []);

    useEffect(() => {
        const debounceFn = setTimeout(() => {
            if (searchTerm) {
                const fetchSearchResults = async () => {
                    const { data } = await axios.get(`http://localhost:5000/review/search/${searchTerm}`);
                    setApplications(data);
                };
                fetchSearchResults();
            } else {
                // Fetch all applications if search term is cleared
                const fetchApplications = async () => {
                    const { data } = await axios.get("http://localhost:5000/review"); 
                    setApplications(data);
                };
                fetchApplications();
            }
        }, 250); // 250ms debounce time

        return () => clearTimeout(debounceFn);
    }, [searchTerm]);

    const handleReview = async (id, comment) => {
        navigate(`/review/${id}`);
    };

    const handleComment = async (id, comment) => {
        try{
            console.log(`Posting comment "${comment}" for application ID: ${id}`);
    
            const data = {
                text: comment,
                commentedby: email,
            };
    
            const response = await axios.post(`http://localhost:5000/review/${id}`, data);
    
            console.log(`Comment posted !!!`);
        }
        catch (e)
        {
            console.error("Error posting comment:", e);
        }
    };

    return (
        <div className="Review" style={{ width: '95%', margin: "auto" }}>
            <h1>Review CVs</h1>

            {/* Search Input */}
            <center>
                <input
                    type="text"
                    placeholder="Search..."
                    style={{ width: '80%', height: '25px', marginBottom: '30px', margin: 'auto' }} // Adjusted width and added height
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </center>
            <br></br>
            <div className="applications" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {applications.map((application, index) => (
                    <div key={index} className="application" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px', height: '100vh', border: '1px solid #ccc', padding: '20px' }}>
                        
                        <div style={{marginRight: 'auto'}}>
                                <strong>
                                    {index +1 }
                                </strong>  
                            </ div>
                        {/* Details and Info on the Left Side */}
                        <div style={{ flexBasis: '40%' }}>
                            <h3>{application.name}</h3>
                            <p><strong>Email:</strong> {application.email}</p>
                            <p><strong>Profile:</strong> {application.profile}</p>
                            <p><strong>Type:</strong> {application.type === 'intern' ? 'Intern' : 'Placement'}</p>
                            <p><strong>Description:</strong> {application.description}</p>
                            {/* Comments Section */}
                            <div className="comments">
                                {application.comments && application.comments.map((comment, commentIndex) => (
                                    <div key={commentIndex} style={{ marginBottom: '10px' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(comment.createdAt).toLocaleDateString()}</p>
                                        <p><strong>{comment.commentedby}:</strong> {comment.text}</p>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                style={{ width: '100%', marginTop: '20px' }}
                            />
                            <button
                                style={{ marginTop: '10px' }}
                                onClick={(e) => {
                                    const input = e.target.previousElementSibling; // Assuming the input is right before the button
                                    handleComment(application._id, input.value);
                                    input.value = ''; // Clear the input after sending
                                }}
                            >
                                Comment
                            </button>
                        </div>
                        {/* PDF on the Right Side */}
                        <div style={{ flexBasis: '60%', height: '100%', marginRight: '20px' }}>
                            <iframe
                                src={`data:application/pdf;base64,${application.pdfFile}`}
                                frameBorder="0"
                                scrolling="yes"
                                style={{ width: '100%', height: '100%' }}
                                title={`CV of ${application.name}`}
                            ></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Review;