import React, {useContext} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EmailContext } from '../EmailContext';
import './Home.css';

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { email } = useContext(EmailContext);
    

    const handleApplyClick = () => {

        navigate('/apply');
    };

    return (
        <div className='homepage'>
            <center>
                <h1>Welcome to Career Canvas { email }!!!</h1>
                <h2>Click here to add new CV</h2>
                <button onClick={handleApplyClick} className='application_link'>
                    Apply
                </button>
            </center>
        </div>
    );
}

export default Home;