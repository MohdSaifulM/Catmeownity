import React, { useState } from 'react';
import { Col, Modal, Card, Image, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { decode } from "jsonwebtoken";
import Axios from 'axios';
import ConfirmUnfollow from '../../landings/dashboard/ConfirmUnfollow';
import pic from '../../resources/nocatpic.png';


function UserFavourites({ cat, fetchUser, ownProfile }) {
    let token = localStorage.getItem('token');
    let user = decode(token)
    Axios.defaults.headers.common['x-auth-token'] = token;

    const [confirmUnfollow, setConfirmUnfollow] = useState(false);
    const [unParams, setUnParams] = useState({
        name: "",
        gender: "",
        ID: "",
    });

    function toConfirmUnfollow(name, gender, ID) {
        setUnParams({
            name,
            gender,
            ID
        })
        setConfirmUnfollow(true)
    }

    async function unfollow(id) {
        await Axios.put(`/api/auth/user/${user.user._id}/unfavourite/${id}`);
        setConfirmUnfollow(false);
        fetchUser();
    }

    function showCatPhoto(cat) {
        if (cat.photos.length > 0) {
          let temp = cat.photos.find(x => x.isDefault)
          return temp.image;
        } else {
          return pic;
        }
      }

    return (
        <Col key={cat._id}>
            <Modal show={confirmUnfollow} onHide={() => (setConfirmUnfollow(false))}>
                <ConfirmUnfollow setConfirmUnfollow={setConfirmUnfollow} name={unParams.name} gender={unParams.gender} unfollow={() => unfollow(unParams.ID)} />
            </Modal>
            <Card>
                <NavLink to={`/cat/${cat._id}`}>
                    <Image src={showCatPhoto(cat)} width="100%" className="img-thumbnail" />
                </NavLink>
                <Card.Header className='h5'>
                    <NavLink className="text-muted text-decoration-none" to={`/cat/${cat._id}`}>{cat.names[0]}</NavLink>
                </Card.Header>
                <Card.Body>
                    <div>{cat.location.street}</div>
                    {ownProfile && <div>
                        <Button variant="outline-danger" block onClick={() => toConfirmUnfollow(cat.names[0], cat.gender, cat._id)}>
                            <i className="fas fa-cat mx-2"></i>Unfollow this cat
                    </Button>
                    </div>}
                </Card.Body>
            </Card>
        </Col>
    )
}

export default UserFavourites
