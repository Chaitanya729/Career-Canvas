import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { EmailContext } from './EmailContext';
import "./Apply.css"

function Apply() {
    const navigate = useNavigate();
    const [pdfFile, setPdfFile] = useState(null);
    const [description, setDescription] = useState('');
    const [pdfPreview, setPdfPreview] = useState('');
    const [profile, setProfile] = useState('');
    const [type, setType] = useState('intern');
    const { email } = useContext(EmailContext); 

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPdfFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPdfPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    async function submit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('pdfFile', pdfFile);
        formData.append('description', description);
        formData.append('profile', profile);
        formData.append('type', type);
        try {
            const response = await axios.post("http://localhost:5000/apply", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data === "Successful") {
                alert("Submission Successful !!!");
                navigate("/home", { state: { id: email } });
            } else {
                alert("Error!!! Try again");
            }
        } catch (error) {
            alert("Error !!!");
            console.log(error);
        }
    }

    return (
        <div className="apply-container">
            <div className="form-container">
                <h1>Upload your CV and Details !!! { email } </h1>
                <form onSubmit={submit}>
                    <p>Upload CV (pdf format only)</p>
                    <input
                        type='file'
                        accept='application/pdf'
                        onChange={handleFileChange}
                    />
                    <p>Email: {email}</p>
                    <p>Profile</p>
                    <input
                        type="text"
                        placeholder='Profile'
                        value={profile}
                        onChange={(e) => setProfile(e.target.value)}
                    />
                    <p>Placement / Internship</p>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Placement">Placement</option>
                        <option value="Intern">Intern</option>
                    </select>
                    <p>Description of your resume</p>
                    <textarea
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button type='submit' className='submit-button'>Submit</button>
                </form>
            </div>
            {pdfPreview && (
                <div className="pdf-preview">
                    <h2>PDF Preview</h2>
                    <iframe
                        src={pdfPreview}
                        frameBorder="0"
                        scrolling="0"
                        width="600"
                        height="800"
                    ></iframe>
                </div>
            )}
        </div>
    );
}

export default Apply;