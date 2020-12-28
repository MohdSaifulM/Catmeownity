import React, { useState, useEffect } from 'react'
import { Container, Form, Jumbotron, Modal } from 'react-bootstrap'
import { NavLink, Redirect, useParams } from 'react-router-dom';
import RegisterCatForm from './RegisterCatForm';
import Axios from 'axios'
import { decode } from "jsonwebtoken";

function RegisterCatContainer() {
    let token = localStorage.getItem('token');
    let user = decode(token);
    Axios.defaults.headers.common['x-auth-token'] = token;

    let { locationID } = useParams()
    const [newCatError, setNewCatError] = useState(false)
    const [breadCrumb, setBreadCrumb] = useState({
        street: "",
        district: "",
        locality: "",
        found: false
    });
    const [adding, setAdding] = useState({
        adding: false,
        added: false,
        id: "",
    });

    useEffect(() => {
        async function fetchLocation() {
            try {
                let resp = await Axios.get(`/api/public/where/${locationID}`);
                setBreadCrumb({
                    street: resp.data.location.street,
                    district: resp.data.location.district.name,
                    locality: resp.data.location.district.locality,
                    found: true,
                });
            } catch (e) {
                // setError(e.response.data.message);
                console.log(e.response)
            }
        }
        fetchLocation()
    }, [locationID])

    function displayLocation() {
        return (
            <>
                {breadCrumb.found &&
                    <div className="mb-4">
                        You are adding a cat to: <br />
                        <div>
                            <NavLink to='/search' className="mx-4"><code>{breadCrumb.locality}</code></NavLink> <small>>></small>
                            <NavLink to='/search' className="mx-4"><code>{breadCrumb.district}</code></NavLink> <small>>></small>
                            <NavLink to={`/location/${locationID}`} className="mx-4"><code>{breadCrumb.street}</code></NavLink>
                        </div>
                    </div>
                }
            </>
        )
    }

    if (adding.added) {
        return <Redirect to={`/cat/${adding.id}`} />
    }
    return (
        <>
            <Jumbotron className='bg-secondary'>
                <div className="ml-5 pl-5">
                    <h1>Add a new cat</h1>
                </div>
            </Jumbotron>
            <Container>
                {/* Location at the top */}
                {displayLocation()}
                <hr />
                <Form.Label>
                    <h5>Tell us more about this cat!</h5>
                </Form.Label>
                <hr />
                <RegisterCatForm setNewCatError={setNewCatError} user={user} locationID={locationID} adding={adding} setAdding={setAdding} />
            </Container>
            <Modal show={newCatError} onHide={() => (setNewCatError(false))}>
                <Modal.Header closeButton>
                    <Modal.Title>Error creating adding the cat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NavLink to={`/location/${locationID}`} className='btn btn-block btn-outline-danger'>Back to cats</NavLink>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RegisterCatContainer
