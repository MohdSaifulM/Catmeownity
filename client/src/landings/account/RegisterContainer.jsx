import React, { useState } from 'react'
import { Container, Jumbotron } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import ProfilePic from './ProfilePic';
import Register from './Register';

const RegisterContainer = ({ setValid }) => {
    const [home, setHome] = useState(false);
    const [showSection, setSection] = useState(1);
    const [formData, setFormData] = useState({});

    if (home) return <Redirect to="/dashboard" />

    return (
        <>
            <Jumbotron className='jumboacc'>
                <div className="ml-5 pl-5 jumboheader">
                    <h1>Register page</h1>
                </div>
            </Jumbotron>
            <Container>
                {showSection === 1 &&
                    <Register nextSection={() => setSection(2)} setFormData={setFormData} />
                }
                {showSection === 2 &&
                    <ProfilePic formData={formData} prevSection={() => setSection(1)} setHome={setHome} setValid={setValid} />
                }
            </Container>
        </>
    )
}

export default RegisterContainer;
