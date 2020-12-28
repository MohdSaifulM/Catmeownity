import React, { useState } from 'react';
import { Col, Modal } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { decode } from "jsonwebtoken";
import Axios from 'axios';
import ConfirmUntrack from '../../landings/dashboard/ConfirmUntrack';

function UserTrackedLocations({ location, fetchUser, ownProfile }) {
    let token = localStorage.getItem('token');
    let user = decode(token)
    Axios.defaults.headers.common['x-auth-token'] = token;

    const [confirmUntrack, setConfirmUntrack] = useState(false);
    const [unParams, setUnParams] = useState({
        name: "",
        gender: "",
        ID: "",
      });

    async function untrack(id) {
        await Axios.put(`/api/auth/user/${user.user._id}/untrack/${id}`);
        fetchUser()
        setConfirmUntrack(false);
    }

    function toConfirmUntrack(name, ID) {
        setUnParams({
            name,
            ID
        })
        setConfirmUntrack(true)
    }
    
    return (
        <Col>
            <Modal show={confirmUntrack} onHide={() => (setConfirmUntrack(false))}>
                <ConfirmUntrack setConfirmUntrack={setConfirmUntrack} location={unParams.name} untrack={() => untrack(unParams.ID)} />
            </Modal>
            <div className="d-flex my-3">
                <NavLink to={`/location/${location._id}`} className='btn btn-success btn-block'>
                    {location.street}
                </NavLink>
                {ownProfile && <div className='btn btn-outline-danger d-flex align-items-center' onClick={() => toConfirmUntrack(location.street, location._id)}>
                    <span aria-hidden="true">&times;</span>
                </div>}
            </div>
        </Col>
    )
}

export default UserTrackedLocations
