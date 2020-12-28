import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Axios from 'axios'
import { Card, Col, Modal, Row } from 'react-bootstrap'
import { decode } from "jsonwebtoken";
import NotLoggedIn from '../../private/NotLoggedIn';
import NewLocation from './NewLocation';

function LocationResult({ district }) {
    let token = localStorage.getItem('token')
    let user = decode(token);
    Axios.defaults.headers.common['x-auth-token'] = token;
    const [locations, setLocations] = useState({ locations: [], found: false })
    const [needToLogIn, setNeedToLogIn] = useState(false);
    const [newLocation, setNewLocation] = useState(false);
    const [trackedLocations, setTrackedLocations] = useState([]);

    useEffect(() => {
        if (district.id !== "") {
            fetchLocation()
            if (user) {
                fetchUserTrackedLocations()
            }
        }
    }, [district])

    async function fetchUserTrackedLocations() {
        try {
            let resp = await Axios.get(`/api/auth/user/tracked/${user.user._id}`);
            setTrackedLocations(resp.data.tracked);
        } catch (e) {
            console.log(e.response)
        }
    }
    async function fetchLocation() {
        try {
            let resp = await Axios.get(`/api/public/location/${district.id}`);
            setLocations({ locations: resp.data.locations, found: true });
        } catch (e) {
            console.log(e.response)
        }
    }
    function showLocations() {
        if (locations.found) {
            if (locations.locations.length > 0) {
                /* sorting the districts by name */
                locations.locations.sort(function (a, b) {
                    var nameA = a.street.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.street.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA >= nameB) {
                        return 1;
                    }
                    return null
                });
                /* display each location or street */
                return (
                    <>
                        <Row md={3}>
                            {locations.locations.map(location => (
                                <Col key={location._id} className="mb-2">
                                    <Card>
                                        <NavLink to={`/location/${location._id}`} className='btn btn-outline-primary'>
                                            {location.street}
                                        </NavLink>
                                        {user &&
                                            <>
                                                {trackedLocations.includes(location._id) ?
                                                    <div className="btn btn-outline-danger" onClick={()=>trackLocation(location._id, false)}>
                                                        Tracked
                                                    </div> :
                                                    <div className="btn btn-outline-secondary" onClick={()=>trackLocation(location._id, true)}>
                                                        Track
                                                    </div>
                                                }
                                            </>
                                        }
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <hr />
                    </>
                )
            }
        }
    }

    function addLocation() {
        if (!user) {
            setNeedToLogIn(true);
            return;
        }
        setNewLocation(true)
    }
    async function trackLocation(location, addOrDel) {
        try {
            await Axios.put(`/api/auth/user/${user.user._id}/${addOrDel ? 'tracked' : 'untrack'}/${location}`);
            fetchUserTrackedLocations();
        } catch (e) {
            console.log(e.response)
        }
    }
    return (
        <>
            <h3>Location</h3>
            <hr />
            {showLocations()}
            <li className='d-flex flex-column nav-link'>
                <p>
                    Do we not have the location you're looking for?
                </p>
                <p>
                    <span id="btn-add-search" className='btn btn-secondary' onClick={addLocation}>Add it here!</span>
                </p>
            </li>
            <Modal show={needToLogIn} onHide={() => (setNeedToLogIn(false))}>
                <NotLoggedIn setNeedToLogIn={setNeedToLogIn} />
            </Modal>
            <Modal show={newLocation} onHide={() => (setNewLocation(false))}
                size="lg" centered>
                <NewLocation setNewLocation={setNewLocation} district={district} fetchLocation={fetchLocation} />
            </Modal>
        </>
    )
}

export default LocationResult
