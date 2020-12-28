import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Col, Container, Form, Image, Jumbotron, Row, Table, Modal } from 'react-bootstrap';
import pic from '../../resources/no-profile-pic.png'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { decode } from "jsonwebtoken";
import UserPhotoUpload from './UserPhotoUpload';
import UserTrackedLocations from './UserTrackedLocations';
import UserFavourites from './UserFavourites';
import MostRecentComments from './MostRecentComments';
import MostRecentFeeding from './MostRecentFeeding';
import ConfirmDeletePhoto from './ConfirmDeletePhoto';


/* REDIRECT IF USER NOT FOUND */

function UserProfile() {
  let token = localStorage.getItem('token');
  let { id } = useParams();
  let loggedUser = decode(token)
  Axios.defaults.headers.common['x-auth-token'] = token;
  const node = useRef()

  //Pulls user data
  const [user, setUser] = useState({
    user: null,
    found: false,
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [form, setForm] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [ownProfile, setOwnProfile] = useState(false);
  const [confirmDelPhoto, setConfirmDelPhoto] = useState(false);

  //fetch user
  useEffect(() => {
    fetchUser()
  }, [id])

  //check if click outside everytime own profile changes
  useEffect(() => {
    // add when mounted
    ownProfile && document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ownProfile]);

  //Check if own profile everytime user changes
  useEffect(() => {
    if (user.found && token) {
      if (user.user._id === loggedUser.user._id) {
        setOwnProfile(true)
        setForm({
          name: user.user.name,
          email: user.user.email,
        })
      } else {
        setOwnProfile(false)
      }
    }
  }, [user])

  async function fetchUser() {
    try {
      let resp = await Axios.get(`/api/user/${id}`);
      setUser({ user: resp.data.user, found: true })
    } catch (err) {
      console.log(err.response)
    }
  }

  const handleClick = e => {
    if (node) {
      if (node.current.contains(e.target)) {
        // inside click
        return;
      }
    }
    // outside click 
    setShowEditProfile(false)
  };

  function changeHandler(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function editProfile() {
    try {
      await Axios.put(`/api/auth/user/${id}`, form);
      setShowEditProfile(false)
      fetchUser()

    } catch (err) {
      console.log(err.response)
    }
  }

  function addPhoto() {
    fetchUser();
  }
  async function delPhoto() {
    try {
      await Axios.delete(`/api/auth/user/delphoto/${user.user._id}`);
      setConfirmDelPhoto(false);
      fetchUser();
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      {/* My Profile Jumbotron */}
      {user.found && <Jumbotron className="bg-dark jumbocat">
        <Container>
          <div id="profile-name">
            <h3 className="mt-4 text-white">{`${user.user.name}'s Profile`}</h3>
          </div>
        </Container>
      </Jumbotron>}

      {/* Start of Profile */}
      {user.found && <Col>
        <Modal show={uploadingPhoto} onHide={() => (setUploadingPhoto(false))} size="lg">
          <UserPhotoUpload setUploadingPhoto={setUploadingPhoto} addPhoto={addPhoto} id={id} />
        </Modal>
        <Modal show={confirmDelPhoto} onHide={() => (setConfirmDelPhoto(false))}>
          <ConfirmDeletePhoto setConfirmDelPhoto={setConfirmDelPhoto} delPhoto={delPhoto} />
        </Modal>
        {!showEditProfile ?
          <Container className="d-flex flex-row border">
            <Row className="p-3">
              <Col>
                <div>
                  <Image className="mx-auto p-4" src={user.user.image ? user.user.image : pic} roundedCircle />
                </div>
                {!user.user.image && ownProfile &&
                  <div>
                    <Col className='text-center py-2'>
                      You don't have a picture yet.
                    </Col>
                    <Col className='text-center'>
                      <div className='btn btn-success' onClick={() => setUploadingPhoto(true)}>
                        Add your first photo!
                      </div>
                    </Col>
                  </div>}
                {ownProfile && user.user.image &&
                  <Col xs={11} className="mx-auto d-flex">
                    <Button id="btn-change-picture" block variant="outline-dark" size="sm" className="my-1 mr-1" onClick={() => setUploadingPhoto(true)}>Change Picture</Button>
                    <Button id="btn-remove-picture" block variant="outline-danger" size="sm" className="my-1 ml-1" onClick={() => setConfirmDelPhoto(true)}>Remove Picture</Button>
                  </Col>}
                {ownProfile && <Col xs={11} className="mx-auto"><Button id="btn-edit-profile" block variant="dark" className="my-1" ref={node} onClick={() => setShowEditProfile(true)}>Edit Profile</Button></Col>}
              </Col>
            </Row>
            <Row className="mt-4">
              <Col className="m-4">
                <div>
                  <Table borderless size="lg">
                    <tbody>
                      <tr>
                        <td><strong>Name: </strong></td>
                        <td> {user.user.name} </td>
                      </tr>
                      <tr>
                        <td><strong>Email: </strong></td>
                        <td> {user.user.email}  </td>
                      </tr>
                    </tbody>
                  </Table> </div>
              </Col>
            </Row>
          </Container> : <div>
            <Container className="d-flex flex-row border">
              <Row className="p-3">
                <Col>
                  <div>
                    <Image className="mx-auto p-4" src={user.user.image ? user.user.image : pic} roundedCircle />
                  </div>
                </Col>
              </Row>
              <Row className="mt-4" ref={node}>
                <Col className="m-4">
                  <small>Name:</small>
                  <Form.Control type="text" placeholder="Enter name" defaultValue={user.user.name} onChange={changeHandler} name="name" aria-describedby="basic-addon2" />
                  <div>
                    <small>Email:</small>
                    <div className="h5">
                      <Form.Control type="text" placeholder="Enter email" onChange={changeHandler} defaultValue={user.user.email} name="email" />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Button variant="dark" onClick={editProfile}>Update</Button>
                  </div>
                </Col>
              </Row>
            </Container>
          </div >}
      </Col>}

      {/* End of Profile */}

      {/* Start of Container with locations and favorite cats */}
      {user.found && <Container className="d-flex border border-dark mt-4 mb-4 justify-content-between bd-highlight">
        <Row className="mt-4">
          <Col>
            <Card className="mb-3 mx-5">
              <Card.Body>
                <Card.Title>Most recent favourites</Card.Title>
                {user.user.favourites.slice(0, 3).map((el) => (
                  <UserFavourites cat={el} fetchUser={fetchUser} ownProfile={ownProfile} />
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <div>
              <Card className="mb-3 mx-5">
                <Card.Body>
                  <Card.Title>Most recent tracked locations</Card.Title>
                  {user.user.trackedLocations.slice(0, 3).map((el) => (
                    <UserTrackedLocations location={el} fetchUser={fetchUser} ownProfile={ownProfile} />
                  ))}
                </Card.Body>
              </Card>
            </div>
            <div>
              <Card className="mb-3 mx-5">
                <Card.Body>
                  <Card.Title>Most recent cativities</Card.Title>
                  <Card>
                    <Card.Body>
                      Most recent comments
                      <ul>
                        {user.user.descForCats.slice(0, 3).map((el) => (
                          <MostRecentComments comment={el} />
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      Most recent feeding
                      <ul>
                        {user.user.fed.slice(0, 3).map((el) => (
                          <MostRecentFeeding fed={el} />
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>}
      {/* End of Container */}
    </>
  )
}

export default UserProfile