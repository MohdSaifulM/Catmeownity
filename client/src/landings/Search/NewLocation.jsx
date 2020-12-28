import React, { useState } from 'react'
import { Button, FormControl, InputGroup, Modal, Row, Col, FormLabel } from 'react-bootstrap'
import Axios from 'axios';
import Loading from '../../Loading';

function NewLocation({ district, setNewLocation, fetchLocation }) {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({ street: "" });
    const [exists, setExists] = useState(false);
    let token = localStorage.getItem('token')
    Axios.defaults.headers.common['x-auth-token'] = token;

    function changeHandler(e) {
        setInput({ street: e.target.value });
    }
    function handleEnter(e) {
        if (e.key === 'Enter') {
            newLocation();
        }
    }
    async function newLocation() {
        setLoading(true);
        try {
            await Axios.post(`/api/auth/location/${district.id}`, input);

            setLoading(false);
            setNewLocation(false);
            fetchLocation();
        } catch (e) {
            if (e.response.data.exists) {
                setExists(true)
            }
            setLoading(false);
        }
    }
    return (
        <div className="p-2">
            <Modal.Header closeButton>
                <Modal.Title>Add a new location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                You are adding a new location to <span className="h5">{district.name}</span>
            </Modal.Body>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <FormControl placeholder="Street name or Location" name="street" onChange={changeHandler} onKeyDown={handleEnter}/>
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={newLocation}>Submit</Button>
                    </InputGroup.Append>
                </InputGroup>
                {exists &&
                    <FormLabel className="ml-2">
                        <small className="text-danger">Location already exists!</small>
                    </FormLabel>
                }
                {loading &&
                    <Row className="justify-content-center">
                        <Col sm={2}>
                            <Loading />
                        </Col>
                    </Row>
                }
            </Modal.Body>
        </div>
    )
}

export default NewLocation

